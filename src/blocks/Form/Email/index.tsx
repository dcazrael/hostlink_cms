import type { EmailField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import React from 'react'

import { BaseInput } from '../BaseInput'

export const Email: React.FC<
  EmailField & {
    errors: Partial<FieldErrorsImpl>
    placeholder?: string | null
    register: UseFormRegister<FieldValues>
  }
> = (props) => {
  return (
    <BaseInput
      type="text"
      validation={{ pattern: /^\S[^\s@]*@\S+$/, required: props.required }}
      {...props}
    />
  )
}
