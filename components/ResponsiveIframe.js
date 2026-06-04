const ResponsiveIframe = ({ title = 'Embedded content', className = '', ...props }) => (
  <div className="my-8 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 shadow-sm dark:border-gray-700 dark:bg-gray-900">
    <div className="aspect-video w-full">
      <iframe
        title={title}
        className={`h-full w-full ${className}`.trim()}
        loading="lazy"
        allowFullScreen
        {...props}
      />
    </div>
  </div>
)

export default ResponsiveIframe
