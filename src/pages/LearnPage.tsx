import { useMemo, useState } from 'react'
import BottomSheet from '../components/BottomSheet'
import { learnCategories, type LearnArticle, type LearnCategory } from '../data/learnContent'

const DISCLAIMER = 'This is general information, not medical advice, and a doctor is the right source for anything personal.'

function normalizeText(value: string) {
  return value.toLowerCase().replace(/\s+/g, ' ').trim()
}

function matchesSearch(article: LearnArticle, query: string) {
  if (!query) return true
  const haystack = normalizeText(`${article.title} ${article.summary} ${article.body}`)
  return haystack.includes(normalizeText(query))
}

function renderBody(body: string) {
  const blocks = body.split(/\n\s*\n/).filter(Boolean)

  return blocks.map((block, blockIndex) => {
    const lines = block.split('\n').map((line) => line.trim()).filter(Boolean)
    const bulletItems = lines.filter((line) => line.startsWith('- '))
    const textLines = lines.filter((line) => !line.startsWith('- '))

    if (bulletItems.length > 0) {
      return (
        <div key={`block-${blockIndex}`} className="space-y-2">
          {textLines.length > 0 && <p>{textLines.join(' ')}</p>}
          <ul className="list-disc space-y-1 pl-5 text-plum-700">
            {bulletItems.map((item, itemIndex) => (
              <li key={`${blockIndex}-item-${itemIndex}`}>{item.replace(/^-\s*/, '')}</li>
            ))}
          </ul>
        </div>
      )
    }

    return <p key={`block-${blockIndex}`}>{lines.join(' ')}</p>
  })
}

function filterCategories(categories: LearnCategory[], query: string) {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    return categories
  }

  return categories
    .map((category) => ({
      ...category,
      articles: category.articles.filter((article) => matchesSearch(article, normalizedQuery)),
    }))
    .filter((category) => category.articles.length > 0)
}

export default function LearnPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    [learnCategories[0].id]: true,
  })
  const [selectedArticle, setSelectedArticle] = useState<LearnArticle | null>(null)

  const isSearchActive = searchQuery.trim().length > 0

  const filteredCategories = useMemo(
    () => filterCategories(learnCategories, searchQuery),
    [searchQuery]
  )

  const toggleCategory = (categoryId: string) => {
    if (isSearchActive) return
    setOpenCategories((current) => ({
      ...current,
      [categoryId]: !current[categoryId],
    }))
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.14em] text-plum-700">Learn</p>
        <h1 className="font-display text-3xl text-plum-900">Wellness basics</h1>
      </div>

      <label className="block">
        <span className="sr-only">Search learn topics</span>
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search articles, symptoms, and topics"
          className="w-full rounded-2xl border border-plum-200 bg-white/80 px-4 py-3 text-sm text-plum-900 shadow-sm shadow-plum-200/30 placeholder:text-plum-500 transition-colors focus:border-blue-500 focus:outline-none"
        />
      </label>

      {filteredCategories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-plum-200 bg-white/60 px-5 py-6 text-center text-sm text-plum-700">
          No topics match &ldquo;{searchQuery}&rdquo;
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCategories.map((category) => {
            const isOpen = isSearchActive || openCategories[category.id] || false

            return (
              <section key={category.id} className="overflow-hidden rounded-2xl border border-plum-100 bg-white/70 shadow-sm shadow-plum-200/20">
                <button
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-blue-50/60"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-cream-100 text-xl" aria-hidden="true">
                      {category.emoji}
                    </span>
                    <span className="font-display text-xl text-plum-900">{category.title}</span>
                  </span>
                  <span className="text-xl text-plum-700">{isOpen ? '−' : '+'}</span>
                </button>

                {isOpen && (
                  <div className="border-t border-plum-100 px-3 py-3">
                    <div className="space-y-2">
                      {category.articles.map((article) => (
                        <button
                          type="button"
                          key={article.id}
                          onClick={() => setSelectedArticle(article)}
                          className="block w-full rounded-xl border border-plum-100 bg-cream-50 px-3.5 py-3 text-left transition-colors hover:border-blue-200 hover:bg-blue-50"
                        >
                          <p className="font-medium text-plum-900">{article.title}</p>
                          <p className="mt-1 text-sm leading-relaxed text-plum-700">{article.summary}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )
          })}
        </div>
      )}

      <BottomSheet
        open={selectedArticle !== null}
        title={selectedArticle?.title ?? 'Article'}
        onClose={() => setSelectedArticle(null)}
      >
        {selectedArticle && (
          <article className="space-y-4 leading-relaxed text-plum-700">
            <p className="text-sm font-medium uppercase tracking-wide text-plum-600">{selectedArticle.summary}</p>
            <div className="space-y-4">{renderBody(selectedArticle.body)}</div>
            <p className="border-t border-plum-100 pt-4 text-sm text-plum-600">{DISCLAIMER}</p>
          </article>
        )}
      </BottomSheet>
    </div>
  )
}
