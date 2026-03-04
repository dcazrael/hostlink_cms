import clsx from 'clsx'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt="Hostlink Logo"
      width={300}
      height={80}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx('h-auto w-full max-w-40 md:max-w-60', className)}
      src="/logo.svg"
    />
  )
}
