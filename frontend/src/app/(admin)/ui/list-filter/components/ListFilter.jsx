'use client';

import ComponentCard from '@/components/ComponentCard';
import Link from 'next/link';
import { useState } from 'react';
const SUGGESTIONS_DATA = [{
  title: 'Programming Languages',
  items: ['JavaScript', 'TypeScript', 'Python', 'Java']
}, {
  title: 'Framework Components',
  items: ['Components', 'Compnent']
}, {
  title: 'Authentication Terms',
  items: ['Auth', 'Authenticate', 'Authntication']
}, {
  title: 'Development Tools',
  items: ['Develop', 'Developer', 'Devlopment', 'Developement']
}, {
  title: 'Configuration Items',
  items: ['Config', 'Configure', 'Configuraton', 'Configration']
}, {
  title: 'Database Terms',
  items: ['Database', 'Data', 'Databse', 'Datatbase', 'DataBase']
}];
export const DidYouMeanSuggestions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredSuggestions = SUGGESTIONS_DATA.map(group => {
    const filteredItems = group.items.filter(item => item.toLowerCase().includes(searchQuery.toLowerCase()));
    return {
      ...group,
      items: filteredItems
    };
  }).filter(group => group.items.length > 0);
  const totalMatches = filteredSuggestions.reduce((acc, curr) => acc + curr.items.length, 0);
  return <ComponentCard title={<h2>Did you mean suggestions</h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Try typing <strong>"javas"</strong> to see suggestions. You can also finetune this for better suggestions via an separate json file.
            Checkout this in the works in our <Link href="">Icon Filter</Link> page.
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text">
              <i className="sa sa-magnifier" />
            </span>
            <input type="text" className="form-control" placeholder="Search with suggestions..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            {searchQuery && <span className="input-group-text text-sm  text-muted">{totalMatches} matches</span>}
          </div>

          <nav className="nav-menu">
            <ul className="nav-menu-list list-unstyled list-spaced">
              {filteredSuggestions.map((group, gIdx) => <div key={gIdx}>
                  <li className="nav-title fw-bold mt-2 text-primary">{group.title}</li>
                  {group.items.map((item, iIdx) => <li key={iIdx}>
                      <Link href="" onClick={e => e.preventDefault()}>
                        <span className="nav-link-text">{item}</span>
                      </Link>
                    </li>)}
                </div>)}
              {filteredSuggestions.length === 0 && <li className="text-muted p-2 text-center">No suggestions found</li>}
            </ul>
          </nav>
        </div>
      </div>
    </ComponentCard>;
};
const FILE_TREE = [{
  name: 'src/',
  isFolder: true,
  children: [{
    name: 'components/',
    isFolder: true,
    children: [{
      name: 'Button.js',
      isFolder: false
    }, {
      name: 'Card.js',
      isFolder: false
    }, {
      name: 'Modal.js',
      isFolder: false
    }, {
      name: 'Form.js',
      isFolder: false
    }, {
      name: 'Table.js',
      isFolder: false
    }, {
      name: 'Chart.js',
      isFolder: false
    }]
  }, {
    name: 'utils/',
    isFolder: true,
    children: [{
      name: 'helpers.js',
      isFolder: false
    }, {
      name: 'constants.js',
      isFolder: false
    }, {
      name: 'validation.js',
      isFolder: false
    }, {
      name: 'formatting.js',
      isFolder: false
    }]
  }, {
    name: 'services/',
    isFolder: true,
    children: [{
      name: 'api.js',
      isFolder: false
    }, {
      name: 'auth.js',
      isFolder: false
    }, {
      name: 'storage.js',
      isFolder: false
    }]
  }]
}, {
  name: 'public/',
  isFolder: true,
  children: [{
    name: '/',
    isFolder: false
  }, {
    name: 'styles.css',
    isFolder: false
  }, {
    name: 'assets/',
    isFolder: true,
    children: [{
      name: 'images/',
      isFolder: true,
      children: []
    }, {
      name: 'fonts/',
      isFolder: true,
      children: []
    }, {
      name: 'icons/',
      isFolder: true,
      children: []
    }]
  }]
}, {
  name: 'tests/',
  isFolder: true,
  children: [{
    name: 'unit/',
    isFolder: true,
    children: []
  }, {
    name: 'integration/',
    isFolder: true,
    children: []
  }, {
    name: 'e2e/',
    isFolder: true,
    children: []
  }]
}];
export const NestedStructure = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const filterTree = (nodes, query) => {
    if (!query) return nodes;
    return nodes.map(node => {
      if (node.isFolder && node.children) {
        const filteredChildren = filterTree(node.children, query);
        if (filteredChildren.length > 0 || node.name.toLowerCase().includes(query.toLowerCase())) {
          return {
            ...node,
            children: filteredChildren
          };
        }
      } else if (node.name.toLowerCase().includes(query.toLowerCase())) {
        return node;
      }
      return null;
    }).filter(node => node !== null);
  };
  const filteredTree = filterTree(FILE_TREE, searchQuery);
  const RenderTreeNodes = ({
    nodes
  }) => {
    return <ul className="list-unstyled ps-3 border-left-faded">
        {nodes.map((node, idx) => <li key={idx} className="my-1">
            <Link href="" onClick={e => e.preventDefault()} className="text-decoration-none">
              <span className={node.isFolder ? 'fw-bold  ' : ''}>
                <i className={`sa ${node.isFolder ? 'sa-folder me-1' : 'sa-file me-1'}`} />
                {node.name}
              </span>
            </Link>
            {node.isFolder && node.children && node.children.length > 0 && <RenderTreeNodes nodes={node.children} />}
          </li>)}
      </ul>;
  };
  return <ComponentCard title={<h2>File Explorer with Nested Structure</h2>} toolbox>
      <div className="panel-container show">
        <div className="panel-content">
          <div className="panel-tag">
            Search through nested file structure with automatic parent folder expansion. Try typing partial words or misspelled terms (e.g., "btn" for
            "Button.js")
          </div>

          <div className="input-group input-group-lg mb-3">
            <span className="input-group-text">
              <i className="sa sa-folder" />
            </span>
            <input type="text" className="form-control" placeholder="Search files..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>

          <nav className="nav-menu p-3 rounded">
            <div className="nav-title fw-bold mb-2 text-muted">Project Root</div>
            {filteredTree.length > 0 ? <RenderTreeNodes nodes={filteredTree} /> : <div className="text-muted p-2 ps-3">No matching files or folders found</div>}
          </nav>
        </div>
      </div>
    </ComponentCard>;
};