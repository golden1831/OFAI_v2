import type { Factory } from "./types"

export default ({
  pages,
  limit = 3, 
  margin = 1,
  currentPage,
}: Factory): Array<string | number> => {
  const elements = []

  if (pages <= limit + 2) {
    for (let i = 0; i < pages; i += 1) elements[i] = i + 1

    return elements
  }

  const halfRange = Math.floor(limit / 2)

  for (let i = 0; i < margin; i += 1) elements[i] = i + 1

  let lowRange = currentPage - halfRange > 0 ? currentPage - 1 - halfRange : 0

  let highRange = lowRange + limit - 1

  if (highRange >= pages) {
    highRange = pages - 1
    lowRange = highRange - limit + 1
  }

  for (
    let index = lowRange;
    index <= highRange && index <= pages - 1;
    index += 1
  ) {
    elements[index] = index + 1
  }

  if (lowRange > margin) elements[lowRange - 1] = "left"

  if (highRange + 1 < pages - margin) elements[highRange + 1] = "right"

  for (let index = pages - 1; index >= pages - margin; index -= 1) {
    elements[index] = index + 1
  }

  return elements
}