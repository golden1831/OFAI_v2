import { useState, type JSX } from "react"

import factory from "./factory"
import type { PaginateProps } from "./types"
import { clsx } from "clsx"
import { ChevronLeft, ChevronRight } from "lucide-react"

const buttonClassName = "flex items-center justify-center size-8 rounded-xl text-sm bg-white/10 font-medium transition-all duration-300 hover:enabled:bg-white/20 disabled:cursor-not-allowed disabled:bg-white/5 md:size-10 md:text-base"

function Paginate({
  total,
  pages,
  limit = 3,
  margin = 1,
  perPage = 20,
  className = "",
  onPaginate,
  currentPage,
  ...rest
}: PaginateProps) {
  const [left, setLeft] = useState(false)
  const [right, setRight] = useState(false)

  if (pages <= 1) return null

  const styled = clsx("flex items-center gap-6 mx-auto", className)

  const pagination = factory({
    pages,
    limit,
    margin,
    currentPage,
  })

  function go(page: string | number) {
    if (page === currentPage || page === "...") return

    onPaginate(Number(page))
  }

  function next() {
    if (currentPage === pages) return

    onPaginate(currentPage + 1)
  }

  function previous() {
    if (currentPage === 1) return

    onPaginate(currentPage - 1)
  }

  const elements: JSX.Element[] = []

  for (const index in pagination) {
    const page = pagination[index]

    if (page === "left") {
      elements.push(
        <button
          key={page}
          type="button"
          onClick={() => go(currentPage - limit)}
          className={buttonClassName}
          onMouseEnter={() => setLeft(true)}
          onMouseLeave={() => setLeft(false)}
        >
          {left ? <ChevronLeft size={16} /> : "..."}
        </button>
      )

      continue; // eslint-disable-line
    }

    if (page === "right") {
      elements.push(
        <button
          key={page}
          type="button"
          onClick={() => go(currentPage + limit)}
          className={buttonClassName}
          onMouseEnter={() => setRight(true)}
          onMouseLeave={() => setRight(false)}
        >
          {right ? <ChevronRight size={16} /> : "..."}
        </button>
      )

      continue; // eslint-disable-line
    }

    elements.push(
      <button
        key={`${index}${page}`}
        type="button"
        onClick={() => go(page)}
        className={clsx(buttonClassName, page === currentPage && "!bg-primary-500")}
      >
        {page}
      </button>
    )
  }

  return (
    <div {...rest} className={styled}>
      <p>{`${perPage} of ${total}`}</p>

      <div className="flex items-center gap-1">
        <button
          onClick={previous}
          disabled={currentPage === 1}
          className={buttonClassName}
        >
          <ChevronLeft size={16} />
        </button>

        {elements}

        <button
          type="button"
          onClick={next}
          disabled={currentPage === pages}
          className={buttonClassName}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

export default Paginate