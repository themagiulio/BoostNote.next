import React from 'react'
import visit from 'unist-util-visit'
import embed from 'embed-video'
import { indexOf } from 'pouchdb-find';

export const iframeOptions = {
  'www.youtube.com': {
    tag: 'iframe',
    width: 560,
    height: 315,
    disabled: false,
    replace: [
      ['watch?v=', 'embed/'],
      ['http://', 'https://'],
    ],
    thumbnail: {
      format: 'http://img.youtube.com/vi/{id}/0.jpg',
      id: '.+/(.+)$'
    },
    removeAfter: '&'
  },
  'youtu.be': {
    width: 560,
    height: 315,
    disabled: false,
    oembed: 'https://www.youtube.com/oembed'
  }
}

export const shortCodeOptions = {
  startBlock: "[[",
  endBlock: "]]",
  inlineMode: true
}

function isValidUrl(string: string) {
  try {
    new URL(string);
  } catch (_) {
    return false;  
  }

  return true;
}

function transformContent(type: string, attrs: string[]) {
    
    switch (type) {
      case 'Dailymotion':
      case 'Vimeo':
      case 'YouTube':
        if(typeof attrs.url == 'string' && isValidUrl(attrs.url)){
          return embed(attrs.url);
        }
      case 'GitHub':
        if(attrs.repo !== undefined){
          return `<a href="https://github.com/${attrs.repo}"><img src="https://gh-card.dev/repos/${attrs.repo}.svg"></a>`;
        }else if(attrs.gist !== undefined && isValidUrl(attrs.gist)){
          return `<script src="${attrs.gist}.js"></script>`;
        }
      case 'link':
        return 'ciao';
      default:
        return `Unsupported Shortcode`;
    }
  }

export const shortCodeTransformer = (exportType: string) => {
    return (tree: any, file: any) => {
      visit(tree, 'shortcode', function(node: any) {
        let type: string = node.identifier;
        let attrs = node.attributes;
        let content = transformContent(type, attrs);
  
        node.type = 'paragraph';
        //node.value = content;
        node.children = [{type: 'a', value: content}]
        
/*         node.type = 'html';
        node.children = [{type: 'a', href: 'https://google.com', value: 'click me'}]
 */      });
    }
  };
