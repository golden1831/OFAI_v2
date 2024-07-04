export const traits = [
  "👯‍♂️ Dominant",
  "🙇‍♀️ Submissive",
  "😈 Kinky",
  "😡 Mean",
  "🥺 Caring",
  "🤯 Open-minded",
  "😇 Loyal",
  "🤓 Nerdy",
  "🤫 Tease",
  "🤘 Adventurous",
  "🤏 Sensual",
  "😎 Playful",
  "👯‍♂️ Seductive",
  "💋 Naughty",
  "💖 Romantic",
  "🔥 Mischievous",
  "🫵 Bold",
  "👅 Insatiable",
  "👀 Curious",
  "🤩 Thrilling",
  "🔞 Erotic",
  "❤️‍🔥 Passionate",
  "⚡ Intense",
  "💥 Sultry",
  "🔭 Voyeuristic",
  "🍑 Exhibitionist",
  "⛓️ Fetishist",
  "🔮 Experimental",
  "🧲 Alluring",
  "🤪 Provocative"
]

export const formattedTraits = traits.map((item) => {
  const [, ...textParts] = item.split(' ');

  const text = textParts.join(' ');

  return { value: text, label: item };
});