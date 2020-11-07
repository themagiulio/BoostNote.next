import unified from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkStringify from 'remark-stringify'
import remarkMath from 'remark-math'
import rehypeDocument from 'rehype-document'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import rehypeKatex from 'rehype-katex'
import remarkIFrames from 'remark-iframes'
import { mergeDeepRight } from 'ramda'
import gh from 'hast-util-sanitize/lib/github.json'
import { rehypeCodeMirror } from './../components/atoms/MarkdownPreviewer'
import { downloadString } from './download'
import { NoteDoc } from './db/types'
import { Preferences } from './preferences'
import { filenamify } from './string'
import remarkShortCodes from 'remark-shortcodes'
import { shortCodeTransformer, shortCodeOptions, iframeOptions } from './shortcodes'

const sanitizeSchema = mergeDeepRight(gh, {
  attributes: { '*': ['className'] },
})

export const exportNoteAsHtmlFile = async (
  note: NoteDoc,
  preferences: Preferences,
  previewStyle?: string
): Promise<void> => {
  await unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkShortCodes, shortCodeOptions)
    .use(shortCodeTransformer, 'paragraph')
    .data('settings', {position: false})
    .use([remarkRehype, { allowDangerousHTML: false }])
    .use(rehypeCodeMirror, {
      ignoreMissing: true,
      theme: preferences['markdown.codeBlockTheme'],
    })
    .use(rehypeRaw)
    .use(rehypeSanitize, sanitizeSchema)
    .use(rehypeDocument, {
      title: note.title,
      style: previewStyle,
      css: 'https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.css',
      meta: { keywords: note.tags.join() },
    })
    .use(rehypeStringify)
    .use(rehypeKatex)
    .process(note.content, (err, file) => {
      if (err != null) {
        /* TODO: Toast error */
        console.error(err)
        return
      }

      downloadString(
        file.toString(),
        `${filenamify(note.title.toLowerCase().replace(/\s+/g, '-'))}.html`,
        'text/html'
      )
      return
    })
}

export const exportNoteAsMarkdownFile = async (
  note: NoteDoc,
  { includeFrontMatter }: { includeFrontMatter: boolean }
): Promise<void> => {
  await unified()
    .use(remarkParse)
    .use(remarkStringify)
    .process(note.content, (err, file) => {
      if (err != null) {
        /* TODO: Toast error */
        console.error(err)
        return
      }
      let content = file.toString().trim() + '\n'
      if (includeFrontMatter) {
        content =
          [
            '---',
            `title: "${note.title}"`,
            `tags: "${note.tags.join()}"`,
            '---',
            '',
            '',
          ].join('\n') + content
      }

      downloadString(
        content,
        `${filenamify(note.title.toLowerCase().replace(/\s+/g, '-'))}.md`,
        'text/markdown'
      )
      return
    })
  return
}
