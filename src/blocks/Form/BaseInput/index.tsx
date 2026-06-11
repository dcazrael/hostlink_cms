import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'

export type BaseInputProps = {
  errors: Partial<FieldErrorsImpl>
  name: string
  defaultValue?: string | null
  label?: string | null
  placeholder?: string | null
  register: UseFormRegister<FieldValues>
  required?: boolean
  type: string
  validation?: Parameters<UseFormRegister<FieldValues>>[1]
  width?: number
}

export const BaseInput: React.FC<BaseInputProps> = ({
  errors,
  name,
  defaultValue,
  label,
  placeholder,
  register,
  required,
  type,
  validation,
  width,
}) => {
  return (
    <Width width={width}>
      <Label htmlFor={name}>
        {label}

        {required && (
          <span className="required">
            * <span className="sr-only">(required)</span>
          </span>
        )}
      </Label>
      <Input
        defaultValue={defaultValue ?? undefined}
        id={name}
        placeholder={placeholder || undefined}
        type={type}
        {...register(name, validation)}
      />

      {errors[name] && <Error name={name} />}
    </Width>
  )
}
