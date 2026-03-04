import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^(_|ignore)',
        },
      ],
    },
  },
  {
    files: ['src/components/**/*.{ts,tsx}', 'src/app/(frontend)/**/*.{ts,tsx}'],
    ignores: ['src/components/admin/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@/components/homepage/uiCopy',
              message:
                'Use direct TranslateFn usage in frontend components. The homepage uiCopy abstraction is deprecated.',
            },
            {
              name: '@payloadcms/ui',
              importNames: ['useTranslation'],
              message:
                'useTranslation is for Payload Admin components. Frontend should use createTranslator and pass t.',
            },
          ],
        },
      ],
    },
  },
  {
    ignores: ['.next/'],
  },
]

export default eslintConfig
