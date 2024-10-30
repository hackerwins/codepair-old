import { Button, Dialog, DialogContent, DialogTitle, List, ListItemButton, ListItemText } from '@mui/material';
import { AppState } from 'app/rootReducer';
import { MimeType } from 'constants/editor';
import { createDoc } from 'features/docSlices';
import { newLink } from 'features/linkSlices';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createDocumentKey, createRandomColor } from 'utils/document';
import yorkie from 'yorkie-js-sdk';
import { MarkdownViewer } from './MarkdownViewer';

import dailySyncTemplate from '../../assets/templates/daily-sync.md?raw';
import performanceReviewTemplate from '../../assets/templates/performance-review.md?raw';

interface TemplateDialogProps {
  onClose: () => void;
  parentId?: string;
}

const templateList = [
  {
    name: 'Daily Sync',
    title: '{date:YY-MM-DD} 데일리 싱크',
    content: dailySyncTemplate,
  },
  {
    name: 'Performance review',
    title: 'Performance review',
    content: performanceReviewTemplate,
  },
];

function convertMarkdownText(markdown: string) {
  return markdown.replace(/\{date:YY-MM-DD\}/g, new Date().toISOString().slice(0, 10));
}

export function TemplateDialog(props: TemplateDialogProps) {
  const { onClose, parentId = '' } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const client = useSelector((state: AppState) => state.docState.client);
  const menu = useSelector((state: AppState) => state.settingState.menu);

  const [selectedTemplate, setSelectedTemplate] = React.useState(0);

  const handleInsertTemplate = useCallback(async () => {
    const newDocKey = `${createDocumentKey()}`;
    const fileLink = `/${newDocKey}`;
    const mimeType = MimeType.MARKDOWN;
    const name = convertMarkdownText(templateList[selectedTemplate].title);

    if (client) {
      await dispatch(
        createDoc({
          client,
          docKey: `codepairs-${newDocKey}`,
          init: (root: any) => {
            const newRoot = root;

            newRoot.content = new yorkie.Text();

            newRoot.content.edit(0, 0, convertMarkdownText(templateList[selectedTemplate].content));
          },
        }) as any,
      );

      setTimeout(() => {
        dispatch(newLink({ parentId, name, mimeType, fileLink, color: createRandomColor().background, emoji: '📅' }));
        setTimeout(() => navigate(fileLink), 100);
        onClose();
      }, 1000);
    }
  }, [dispatch, client, parentId, navigate, onClose, selectedTemplate]);

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Template</DialogTitle>
      <DialogContent>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <div
            style={{
              width: 300,
              flex: 'none',
            }}
          >
            <List
              style={{
                width: '100%',
              }}
            >
              {templateList.map((template, index) => {
                return (
                  <ListItemButton
                    key={template.content}
                    onClick={() => {
                      setSelectedTemplate(index);
                    }}
                    selected={selectedTemplate === index}
                  >
                    <ListItemText primary={template.name} />
                  </ListItemButton>
                );
              })}
            </List>
          </div>
          <div
            style={{
              width: '50%',
              flex: '1 1 auto',
              height: 600,
              overflow: 'auto',
              border: '1px solid #ccc',
            }}
          >
            <div
              className="markdown-viewer"
              style={{
                padding: 16,
              }}
            >
              <MarkdownViewer markdown={templateList[selectedTemplate].content} theme={menu.theme} />
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: 16,
            gap: 10,
          }}
        >
          <Button
            variant="outlined"
            onClick={onClose}
            style={{
              color: 'red',
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" disableElevation onClick={handleInsertTemplate}>
            Insert Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
