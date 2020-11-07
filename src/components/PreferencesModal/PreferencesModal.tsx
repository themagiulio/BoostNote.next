import React, { useState, useMemo } from 'react'
import styled from '../../lib/styled'
import { usePreferences } from '../../lib/preferences'
import TabButton from './TabButton'
import { useGlobalKeyDownHandler } from '../../lib/keyboard'
import GeneralTab from './GeneralTab'
import EditorTab from './EditorTab'
import MarkdownTab from './MarkdownTab'
import AboutTab from './AboutTab'
import BillingTab from './BillingTab'
import ThirdPartyServicesTab from './ThirdPartyServicesTab'
import {
  backgroundColor,
  closeIconColor,
  border,
  flexCenter,
  borderBottom,
  borderLeft,
} from '../../lib/styled/styleFunctions'
import { useTranslation } from 'react-i18next'
import Icon from '../atoms/Icon'
import { mdiClose, mdiHammerWrench } from '@mdi/js'
import { useDb } from '../../lib/db'
import { useRouteParams } from '../../lib/routeParams'
import StorageTab from './StorageTab'

const FullScreenContainer = styled.div`
  z-index: 7000;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const BackgroundShadow = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  ${border}
`

const ContentContainer = styled.div`
  z-index: 7001;
  position: relative;
  height: calc(100% - 90px);
  width: calc(100% - 2em);
  display: flex;
  flex-direction: column;
  max-width: 1080px;
  margin: 45px auto;
  ${backgroundColor}
  ${border}
`

const ModalHeader = styled.div`
  height: 40px;
  ${borderBottom}
  display: flex;
`

const ModalTitle = styled.h1`
  margin: 0;
  line-height: 40px;
  font-size: 1em;
  font-weight: bold;
  padding: 0 10px;
  flex: 1;
  display: flex;
  align-items: center;
`

const ModalBody = styled.div`
  display: flex;
  overflow: hidden;
  height: 100%;
`

const TabNav = styled.nav`
  width: 200px;
`

const TabContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1em;
  ${borderLeft}
`

const CloseButton = styled.button`
  width: 40px;
  height: 40px;
  background-color: transparent;
  border: none;
  font-size: 24px;
  ${flexCenter}
  ${closeIconColor}
`

const PreferencesModal = () => {
  const { t } = useTranslation()
  const { closed, togglePreferencesModal } = usePreferences()
  const [tab, setTab] = useState('about')
  const { storageMap } = useDb()
  const routeParams = useRouteParams()

  const currentStorage = useMemo(() => {
    let storageId: string
    switch (routeParams.name) {
      case 'storages.notes':
      case 'storages.tags.show':
      case 'storages.attachments':
      case 'storages.trashCan':
        storageId = routeParams.storageId
        break
      default:
        return null
    }
    const storage = storageMap[storageId]
    return storage != null ? storage : null
  }, [storageMap, routeParams])

  const keydownHandler = useMemo(() => {
    return (event: KeyboardEvent) => {
      if (!closed && event.key === 'Escape') {
        togglePreferencesModal()
      }
    }
  }, [closed, togglePreferencesModal])
  useGlobalKeyDownHandler(keydownHandler)

  const content = useMemo(() => {
    switch (tab) {
      case 'editor':
        return <EditorTab />
      case 'markdown':
        return <MarkdownTab />
      case 'ThirdPartyServices':
        return <ThirdPartyServicesTab />
      case 'about':
        return <AboutTab />
      case 'billing':
        return <BillingTab />
      case 'storage':
        if (currentStorage != null) {
          return <StorageTab storage={currentStorage} />
        }
      case 'general':
      default:
        return <GeneralTab />
    }
  }, [tab, currentStorage])

  if (closed) {
    return null
  }

  return (
    <FullScreenContainer>
      <ContentContainer>
        <ModalHeader>
          <ModalTitle>
            <Icon size={24} path={mdiHammerWrench} />
            {t('preferences.general')}
          </ModalTitle>
          <CloseButton onClick={togglePreferencesModal}>
            <Icon path={mdiClose} />
          </CloseButton>
        </ModalHeader>
        <ModalBody>
          <TabNav>
            <TabButton
              label={t('about.about')}
              tab='about'
              active={tab === 'about'}
              setTab={setTab}
            />
            <TabButton
              label={t('general.general')}
              tab='general'
              active={tab === 'general'}
              setTab={setTab}
            />
            {currentStorage != null && (
              <TabButton
                label='Storage'
                tab='storage'
                active={tab === 'storage'}
                setTab={setTab}
              />
            )}
            <TabButton
              label={t('editor.editor')}
              tab='editor'
              active={tab === 'editor'}
              setTab={setTab}
            />
            <TabButton
              label='Markdown'
              tab='markdown'
              active={tab === 'markdown'}
              setTab={setTab}
            />
            <TabButton
              label={t('thirdPartyServices.thirdPartyServices')}
              tab='ThirdPartyServices'
              active={tab === 'ThirdPartyServices'}
              setTab={setTab}
            />
            <TabButton
              label={t('billing.billing')}
              tab='billing'
              active={tab === 'billing'}
              setTab={setTab}
            />
          </TabNav>
          <TabContent>{content}</TabContent>
        </ModalBody>
      </ContentContainer>
      <BackgroundShadow onClick={togglePreferencesModal} />
    </FullScreenContainer>
  )
}

export default PreferencesModal
