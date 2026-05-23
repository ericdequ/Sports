import Image from './Image'
import Link from './Link'

const Card = ({ title, description, imgSrc, href }) => (
  <div className="feature-card">
    {imgSrc && (
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          alt={title}
          src={imgSrc}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover object-center"
        />
      </div>
    )}
    <div className="p-5 sm:p-6">
      <h2 className="mb-3 text-xl font-black leading-tight text-gray-950 dark:text-white sm:text-2xl">
        {href ? (
          <Link href={href} aria-label={`Link to ${title}`}>
            {title}
          </Link>
        ) : (
          title
        )}
      </h2>
      <p className="mb-4 text-sm leading-7 text-gray-600 dark:text-gray-300 sm:text-base">
        {description}
      </p>
      {href && (
        <Link href={href} className="read-link" aria-label={`Link to ${title}`}>
          Learn more &rarr;
        </Link>
      )}
    </div>
  </div>
)

export default Card
