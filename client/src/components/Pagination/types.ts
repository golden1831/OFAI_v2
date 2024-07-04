import type { HTMLAttributes } from "react"

export type Factory = {
  pages: number
  limit?: number
  margin?: number
  currentPage: number
}

export interface PaginateProps extends Factory, HTMLAttributes<HTMLDivElement> {
  total: number
  perPage: number
  onPaginate: (page: number) => void
}