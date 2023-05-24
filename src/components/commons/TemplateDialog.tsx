import { Button, Dialog, DialogContent, DialogTitle, List, ListItemButton, ListItemText } from '@mui/material';
import React, { useCallback } from 'react';
import { MarkdownViewser } from './MarkdownViewser';

interface TemplateDialogProps {
  onClose: () => void;
}

const templateList = [
  {
    name: 'Template 1',
    content: `# {date:YY-MM-DD} 실시간 협업 플랫폼 데일리 싱크

## Name 🏠
어제
- 
오늘
- 
토론        

## Name 🏢
어제
- 
- 
오늘
- 
토론
## Name 🏠
어제
- 
오늘
- 
토론

## 프로젝트 현황
23년 2Q
- [x] 1. 

23년 1Q
- [x] 1. 

23년 목표
- 
        `,
  },
];

function convertMarkdownText(markdown: string) {
  return markdown.replace(/\{date:YY-MM-DD\}/g, new Date().toISOString().slice(0, 10));
}

export function TemplateDialog(props: TemplateDialogProps) {
  const { onClose } = props;
  const [selectedTemplate, setSelectedTemplate] = React.useState(0);

  const handleInsertTemplate = useCallback(() => {
    const cm = document.querySelector('.CodeMirror');

    if (cm) {
      const { CodeMirror: CodeMirrorInstance } = cm as any;

      CodeMirrorInstance.setValue(convertMarkdownText(templateList[selectedTemplate].content));

      onClose();
    }
  }, [onClose, selectedTemplate]);

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
            <div className="markdown-viewer">
              <MarkdownViewser markdown={templateList[selectedTemplate].content} />
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
