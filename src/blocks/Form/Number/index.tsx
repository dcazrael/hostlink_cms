import type { TextField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import React from 'react'

import { BaseInput } from '../BaseInput'

export const Number: React.FC<
  TextField & {
    errors: Partial<FieldErrorsImpl>
    placeholder?: string | null
    register: UseFormRegister<FieldValues>
  }
> = (props) => {
  return <BaseInput type="number" validation={{ required: props.required }} {...props} />
}
