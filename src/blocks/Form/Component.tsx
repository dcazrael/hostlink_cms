'use client'
import type { FormFieldBlock, Form as FormType } from '@payloadcms/plugin-form-builder/types'

import { TurnstileChallenge } from '@/components/form/TurnstileChallenge'
import { resolveLucideName } from '@/components/homepage/utils'
import { LucideIcon } from '@/components/LucideIcon'
import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { useRouter } from 'next/navigation'
import React, { useCallback, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { getClientSideURL } from '@/utilities/getURL'
import { fields } from './fields'

const HONEYPOT_FIELD = 'spam_hp'
const STARTED_AT_FIELD = 'spam_startedAt'
const TURNSTILE_TOKEN_FIELD = 'spam_turnstileToken'

const readTurnstileTokenFromDOM = (formID?: number | string): string => {
  if (typeof document === 'undefined') return ''

  const selector = '[name="cf-turnstile-response"]'
  const formElement =
    typeof formID === 'string' || typeof formID === 'number'
      ? document.getElementById(String(formID))
      : null

  const scopedElement =
    formElement?.querySelector<HTMLInputElement | HTMLTextAreaElement>(selector) || null
  const globalElement = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(selector)

  return scopedElement?.value?.trim() || globalElement?.value?.trim() || ''
}

const getErrorCandidates = (response: unknown): string[] => {
  if (!response || typeof response !== 'object') return []

  const data = response as {
    errors?: Array<{ message?: unknown; path?: unknown }>
    message?: unknown
  }
  const candidates: string[] = []

  if (typeof data.message === 'string' && data.message.trim().length > 0) {
    candidates.push(data.message.trim())
  }

  if (Array.isArray(data.errors)) {
    for (const entry of data.errors) {
      if (typeof entry?.message === 'string' && entry.message.trim().length > 0) {
        candidates.push(entry.message.trim())
      }
      if (typeof entry?.path === 'string' && entry.path.trim().length > 0) {
        candidates.push(entry.path.trim())
      }
    }
  }

  return candidates
}

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: FormType
  introContent?: DefaultTypedEditorState
}

export const FormBlock: React.FC<
  {
    id?: string
  } & FormBlockType
> = (props) => {
  const {
    enableIntro,
    form: formFromProps,
    form: { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel } = {},
    introContent,
  } = props
  const submitButtonIcon = (formFromProps as FormType & { submitButtonIcon?: unknown })
    .submitButtonIcon
  const submitButtonIconName = resolveLucideName(submitButtonIcon)

  const formMethods = useForm({
    defaultValues: formFromProps.fields,
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const [honeypotValue, setHoneypotValue] = useState('')
  const [isCaptchaVisible, setIsCaptchaVisible] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const startedAtRef = useRef<number>(Date.now())
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''
  const router = useRouter()
  const isCaptchaError = Boolean(error?.message && /captcha/i.test(error.message))

  const handleTurnstileError = useCallback(() => {
    setError({
      message: 'Captcha widget failed to load. Please refresh and try again.',
      status: '400',
    })
  }, [])

  const handleTurnstileToken = useCallback((token: string) => {
    setTurnstileToken(token.trim())
  }, [])

  const onSubmit = useCallback(
    (data: FormFieldBlock[]) => {
      let loadingTimerID: ReturnType<typeof setTimeout>
      const submitForm = async () => {
        setError(undefined)
        const tokenFromWidget = (turnstileToken || readTurnstileTokenFromDOM(formID)).trim()

        if (isCaptchaVisible && !tokenFromWidget) {
          setError({
            message: 'Please complete the captcha challenge and submit again.',
            status: '400',
          })
          return
        }

        const formValues = data as unknown as Record<string, unknown>
        const dataToSend = Object.entries(formValues).map(([name, value]) => ({
          field: name,
          value,
        }))

        dataToSend.push(
          {
            field: HONEYPOT_FIELD,
            value: honeypotValue,
          },
          {
            field: STARTED_AT_FIELD,
            value: String(startedAtRef.current),
          },
          {
            field: TURNSTILE_TOKEN_FIELD,
            value: tokenFromWidget,
          },
        )

        // delay loading indicator by 1s
        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)
            const errorCandidates = getErrorCandidates(res)
            const hasCaptchaRequired = errorCandidates.some((value) =>
              value.includes('CAPTCHA_REQUIRED'),
            )
            const hasCaptchaInvalid = errorCandidates.some((value) =>
              value.includes('CAPTCHA_INVALID'),
            )
            const hasRateLimited = errorCandidates.some((value) => value.includes('RATE_LIMITED'))
            const hasSubmissionDataValidation = errorCandidates.some((value) =>
              value.toLowerCase().includes('submissiondata'),
            )
            const fallbackMessage = errorCandidates[0] || 'Internal Server Error'

            if (hasCaptchaRequired || hasSubmissionDataValidation) {
              setIsCaptchaVisible(true)
              setTurnstileToken('')
              setError({
                message: 'Please complete the captcha challenge and submit again.',
                status: '400',
              })
              return
            }

            if (hasCaptchaInvalid) {
              setIsCaptchaVisible(true)
              setTurnstileToken('')
              setError({
                message: 'Captcha verification failed. Please try again.',
                status: '400',
              })
              return
            }

            if (hasRateLimited) {
              setError({
                message: 'Too many submissions from this network. Please try again later.',
                status: '429',
              })
              return
            }

            setError({
              message: fallbackMessage,
              status: res.status,
            })

            return
          }

          setIsLoading(false)
          setHasSubmitted(true)
          setIsCaptchaVisible(false)
          setTurnstileToken('')

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect

            const redirectUrl = url

            if (redirectUrl) router.push(redirectUrl)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({
            message: 'Something went wrong.',
          })
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType, honeypotValue, isCaptchaVisible, turnstileToken],
  )

  return (
    <div className="container lg:max-w-3xl">
      {enableIntro && introContent && !hasSubmitted && (
        <RichText className="mb-8 lg:mb-12" data={introContent} enableGutter={false} />
      )}
      <div className="">
        <FormProvider {...formMethods}>
          {!isLoading && hasSubmitted && confirmationType === 'message' && (
            <RichText data={confirmationMessage} className="text-center" />
          )}
          {isLoading && !hasSubmitted && <p>Loading, please wait...</p>}
          {!isCaptchaError && error && (
            <div>{`${error.status || '500'}: ${error.message || ''}`}</div>
          )}
          {!hasSubmitted && (
            <form className="relative" id={formID} onSubmit={handleSubmit(onSubmit)}>
              <div aria-hidden className="absolute left-2500 top-auto h-px w-px overflow-hidden">
                <label htmlFor={`${formID || 'form'}-website`}>Website</label>
                <input
                  autoComplete="off"
                  id={`${formID || 'form'}-website`}
                  name={`${formID || 'form'}-website`}
                  onChange={(event) => setHoneypotValue(event.target.value)}
                  tabIndex={-1}
                  type="text"
                  value={honeypotValue}
                />
              </div>

              <div className="mb-4 last:mb-0">
                {formFromProps &&
                  formFromProps.fields &&
                  formFromProps.fields?.map((field, index) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const Field: React.FC<any> = fields?.[field.blockType as keyof typeof fields]
                    if (Field) {
                      return (
                        <div className="mb-6 last:mb-0" key={index}>
                          <Field
                            form={formFromProps}
                            {...field}
                            {...formMethods}
                            control={control}
                            errors={errors}
                            register={register}
                          />
                        </div>
                      )
                    }
                    return null
                  })}
              </div>

              {isCaptchaVisible ? (
                <div className="mb-4 space-y-2 rounded-xl border border-border bg-card p-4">
                  {turnstileSiteKey ? (
                    <TurnstileChallenge
                      onError={handleTurnstileError}
                      onToken={handleTurnstileToken}
                      siteKey={turnstileSiteKey}
                    />
                  ) : (
                    <p className="text-sm text-destructive">
                      Captcha is not configured. Please contact support.
                    </p>
                  )}
                  {turnstileSiteKey ? (
                    <p className="text-xs text-muted-foreground">
                      {turnstileToken
                        ? 'Captcha verified. Click submit again.'
                        : 'Complete the captcha challenge to enable submit.'}
                    </p>
                  ) : null}
                  <p className="text-xs text-muted-foreground">
                    {isCaptchaError
                      ? error?.message
                      : 'Please complete the captcha challenge, then click submit again.'}
                  </p>
                </div>
              ) : null}

              <Button
                disabled={isLoading || (isCaptchaVisible && (!turnstileSiteKey || !turnstileToken))}
                form={formID}
                type="submit"
                variant="default"
                className="w-full"
              >
                {submitButtonIconName ? (
                  <LucideIcon className="size-4" name={submitButtonIconName} />
                ) : null}
                {submitButtonLabel}
              </Button>
            </form>
          )}
        </FormProvider>
      </div>
    </div>
  )
}
