import React, { useState, useCallback } from 'react'
import {
  Section,
  SectionHeader,
  SectionControl,
  SectionPrimaryButton,
  SectionSecondaryButton,
  SectionSelect,
  SectionInput
} from './styled'
import CustomizedCodeEditor from '../atoms/CustomizedCodeEditor'
import CustomizedMarkdownPreviewer from '../atoms/CustomizedMarkdownPreviewer'
import { usePreferences } from '../../lib/preferences'
import styled from '../../lib/styled'
import { SelectChangeEventHandler } from '../../lib/events'
import { themes } from '../../lib/CodeMirror'
import { capitalize } from '../../lib/string'
import { useTranslation } from 'react-i18next'
import { usePreviewStyle, defaultPreviewStyle } from '../../lib/preview'
import { borderRight, border } from '../../lib/styled/styleFunctions'
import { FormCheckItem, FormSecondaryButton } from '../atoms/form'
import { useDebounce } from 'react-use'

const EditorContainer = styled.div`
  ${border}
`

const defaultPreviewContent = `# hello-world.js

\`\`\`js
function say() {
  console.log('Hello, World!')
}
\`\`\`
`
const PreviewContainer = styled.div`
  display: flex;
  flex-direction: row;
  ${border}
  .panel {
    width: 50%;
    padding: 15px;

    &:first-child {
      ${borderRight}
    }
  }
`

const ThirdPartyServicesTab = () => {

  const { preferences, setPreferences } = usePreferences()

  const [gitHubRepo, setGitHubRepo] = useState(
    preferences['thirdPartyServices.gitHubRepo'].toString()
  )
  const updateGitHubRepo: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      setGitHubRepo(event.target.value)
    },
    [setGitHubRepo]
  )
  useDebounce(
    () => {
      setPreferences({
        'thirdPartyServices.gitHubRepo': gitHubRepo
      })
    },
    500,
    [gitHubRepo, setPreferences]
  )

  const { t } = useTranslation()

  return (
    <div>
      <Section>
        <SectionHeader>{t('thirdPartyServices.shortCodes')}</SectionHeader>
        <pre>[[ YouTube url="VIDEO URL" ]]</pre>

        <pre>[[ Vimeo url="VIDEO URL" ]]</pre>

        <pre>[[ Dailymotion url="VIDEO URL" ]]</pre>

        <pre>[[ GitHub repo="USERNAME/REPOSITORY" ]]</pre>

        <pre>[[ GitHub gist="GIST URL" ]]</pre>
      </Section>
      <Section>
        <SectionHeader>{t('thirdPartyServices.gitHub')}</SectionHeader>
        <SectionControl>
          <SectionInput
            type='string'
            value={gitHubRepo}
            onChange={updateGitHubRepo}
          />
        </SectionControl>
      </Section>
    </div>
  )
}

export default ThirdPartyServicesTab
