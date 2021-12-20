import type { NextPage } from 'next'
import { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import Asciidoctor from '@asciidoctor/core'
import { closeBrackets } from '@codemirror/closebrackets'
import { indentWithTab } from '@codemirror/commands'
import { highlightActiveLineGutter, lineNumbers } from '@codemirror/gutter'
import { EditorState } from '@codemirror/state'
import { highlightActiveLine, EditorView, keymap } from '@codemirror/view'
import styles from '../styles/Home.module.css'
import '../node_modules/@asciidoctor/core/dist/css/asciidoctor.css'

const parse = (rawBody: string) => {
  const asciidoctor = Asciidoctor()

  return asciidoctor.convert(rawBody) as string
}

const Preview = ({ html }: { html: string }) => {
  return (
    <div className={styles.preview} dangerouslySetInnerHTML={{
      __html: html
    }} />
  )
}

const AsciiDocEditor = ({ defaultValue, onChange }: { defaultValue: string, onChange: (value: string) => void }) => {
  const editorParentRef = useRef<HTMLDivElement | null>(null)

  const updateCallback = EditorView.updateListener.of((update) => update.docChanged && onChange(update.state.doc.toString()))

  useEffect(() => {
    if (editorParentRef.current === null) return

    const editorView = new EditorView({
      state: EditorState.create({
        doc: defaultValue,
        extensions: [
          closeBrackets(),
          lineNumbers(),
          highlightActiveLine(),
          highlightActiveLineGutter(),
          keymap.of([indentWithTab]),
          updateCallback,
        ],
      }),
      parent: editorParentRef.current,
    })

    return () => {
      editorView.destroy()
    }
  }, [editorParentRef])

  return <div ref={editorParentRef} className={styles.editor} />
}

const Home: NextPage = () => {
  const defaultDoc = `= Document Title
Author line
:description: Description

== AsciiDoc Sample

http://asciidoctor.org[*Asciidoctor*]
running on https://opalrb.com[_Opal_]
brings AsciiDoc to Node.js!`

  const [text, setText] = useState<string>(defaultDoc)

  return (
    <div>
      <Head>
        <title>AsciiDoc Editor</title>
        <meta name="AsciiDoc Editor" content="AsciiDoc Editor" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className={styles.editorWrapper}>
          <AsciiDocEditor defaultValue={text} onChange={(value) => setText(value)} />

          <Preview html={parse(text)} />
        </div>
      </main>
    </div>
  )
}

export default Home
