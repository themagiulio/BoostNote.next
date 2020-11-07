import visit from 'unist-util-visit'

function transformContent(type: string, attrs: string[]) {
    //console.log(type, attrs);
    switch (type) {
      case 'YouTube':
        return `<div>${attrs.url}</div>`;
      default:
        return `Boost Note can't recognize the following shortcode: ${type}`;
    }
  }
  
  
export const shortcodeTransformer = () => {
    return (tree: any, file: any) => {
      visit(tree, 'shortcode', function(node: any) {
        let type: string = node.identifier;
        let attrs = node.attributes;
        let content = transformContent(type, attrs);
  
        node.type = 'pre';
        node.value = content;
      });
    }
  };
