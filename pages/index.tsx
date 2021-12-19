import type { NextPage } from 'next'
import Head from 'next/head'
import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { useEffect, useRef, useState } from 'react'
import Asciidoctor from '@asciidoctor/core'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const editorParentRef = useRef<HTMLDivElement | null>(null)
  const a = Asciidoctor()

  const defaultDoc = `= Document Title
Author line
:description: Description

== AsciiDoc Sample

http://asciidoctor.org[*Asciidoctor*] running on https://opalrb.com[_Opal_] brings AsciiDoc to Node.js!
  `

  const [body, setBody] = useState<any>(a.convert(defaultDoc))

  useEffect(() => {
    if (editorParentRef.current === null) return

    const editorView = new EditorView({
      state: EditorState.create({
        doc: defaultDoc,
        extensions: [
          EditorView.updateListener.of((update) => update.docChanged && setBody(a.convert(update.state.doc.sliceString(0, undefined, "\n")))),
        ],
      }),
      parent: editorParentRef.current,
    })

    return () => {
      editorView.destroy()
    }
  }, [])

  return (
    <div>
      <Head>
        <title>Editor</title>
        <meta name="editor" content="editor" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div>
          <h1>
            Editor
          </h1>
        </div>

        <div className={styles.editorWrapper}>
          <div ref={editorParentRef} className={styles.editor} />

          <div className={styles.preview} dangerouslySetInnerHTML={{
            __html: body
          }} />
        </div>
      </main>
    </div>
  )
}

export default Home
