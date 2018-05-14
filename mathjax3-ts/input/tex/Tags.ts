/*************************************************************
 *
 *  Copyright (c) 2018 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */


/**
 * @fileoverview Class for generating tags, references, etc.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import TexParser from './TexParser.js';
import {TreeHelper} from './TreeHelper.js';
import {MmlNode} from '../../core/MmlTree/MmlNode.js';
import {EnvList} from './StackItem.js';
import ParseOptions from './ParseOptions.js';


/**
 *  Simple class for label objects.
 */
export class Label {

  /**
   * @constructor
   * @param {string=} tag The tag that's displayed.
   * @param {string=} id The id that serves as reference.
   */
  constructor(public tag: string = '???', public id: string = '') {}
}


/**
 * A simple class for keeping track of tag information.
 */
export class TagInfo {

  /**
   * @constructor
   * @param {string} env The environment name (e.g., align).
   * @param {boolean} taggable Environment supports tags (e.g., align* does, but
   *     spit does not.)
   * @param {boolean} defaultTags Environment is tagged by default (e.g., align
   *     is, but align* is not).
   * @param {string} tag The tag name (e.g., 1).
   * @param {string} tagId The unique id for that tag (e.g., mjx-eqn-1).
   * @param {string} tagFormat The formatted tag (e.g., "(1)").
   * @param {boolean} noTag A no tagging command has been set (e.g., \notag,
   *     \nonumber).
   * @param {string} labelId The label referring to the tag.
   */
  constructor(readonly env: string = '',
              readonly taggable: boolean = false,
              readonly defaultTags: boolean = false,
              public tag: string = null,
              public tagId: string = '',
              public tagFormat: string = '',
              public noTag: boolean = false,
              public labelId: string = '') {}

}


export interface Tags {

  /**
   * The global configurations in which the parsing takes place.
   * @type {ParseOptions}
   */
  configuration: ParseOptions;

  /**
   * IDs used in this equation.
   * @type {Object.<boolean>}
   */
  ids: {[key: string]: boolean};

  /**
   * IDs used in previous equations.
   * @type {Object.<boolean>}
   */
  allIds: {[key: string]: boolean};

  /**
   * Labels in the current equation.
   * @type {Object.<Label>}
   */
  labels: {[key: string]: Label};

  /**
   * Labels in previous equations.
   * @type {Object.<Label>}
   */
  allLabels: {[key: string]: Label};

  /**
   * Nodes with unresolved references.
   * @type {MmlNode[]}
   */
  // Not sure how to handle this at the moment.
  refs: MmlNode[]; // array of nodes with unresolved references

  /**
   * How to format tags.
   * @param {string} tag The tag string.
   * @return {string} The formatted numbered tag.
   */
  formatTag(tag: string): string;

  /**
   * How to format URLs for references.
   * @param {string} id The reference id.
   * @param {string} base The base URL in the reference.
   * @return {}
   */
  formatUrl(id: string, base: string): string;

  /**
   * Set the tag automatically, by incrementing equation number.
   */
  autoTag(): void;

  /**
   * @return {MmlNode|void} Generates and returns the tag node.
   */
  getTag(): MmlNode | void;

  /**
   * Clears tagging information.
   */
  clearTag(): void;

  /**
   * Resets the tag structure.
   * @param {number} offset A new offset value to start counting ids from.
   * @param {boolean} keep If sets, keep all previous labels and ids at reset.
   */
  reset(offset: number, keep: boolean): void;

  finalize(node: MmlNode, env: EnvList): MmlNode;

  start(env: string, taggable: boolean, defaultTags: boolean): void;
  end(): void;
  tag(tag: string, format: boolean): void;
  notag(): void;
  label: string;
  env: string;

  currentTag: TagInfo;
  enTag(node: MmlNode, tag: MmlNode): MmlNode;
}


export class AbstractTags implements Tags {

  /**
   * Current equation number.
   * @type {number}
   */
  protected counter: number = 0;

  /**
   * Current starting equation number (for when equation is restarted).
   * @type {number}
   */
  protected offset: number = 0;

  /**
   * @override
   */
  public configuration: ParseOptions = null;

  /**
   * @override
   */
  public ids: {[key: string]: boolean} = {};

  /**
   * @override
   */
  public allIds: {[key: string]: boolean} = {};

  /**
   * Labels in the current equation.
   * @type {Object.<boolean>}
   */
  public labels: {[key: string]: Label} = {};

  /**
   * Labels in previous equations.
   * @type {Object.<boolean>}
   */
  public allLabels: {[key: string]: Label} = {};

  /**
   * Nodes with unresolved references.
   * @type {MmlNode[]}
   */
  // Not sure how to handle this at the moment.
  public refs: MmlNode[] = new Array(); // array of nodes with unresolved references

  public currentTag: TagInfo = new TagInfo();


  /**
   * Chronology of all previous tags, in case we need to look something up in
   * the finalize method.
   * @type {TagInfo[]}
   */
  protected history: TagInfo[] = [];

  private stack: TagInfo[] = [];


  public start(env: string, taggable: boolean, defaultTags: boolean) {
    if (this.currentTag) {
      this.stack.push(this.currentTag);
    }
    this.currentTag = new TagInfo(env, taggable, defaultTags);
  }

  public get env() {
    return this.currentTag.env;
  }

  public end() {
    this.history.push(this.currentTag);
    this.currentTag = this.stack.pop();
  }

  public tag(tag: string, noFormat: boolean) {
    this.currentTag.tag = tag;
    this.currentTag.tagFormat = noFormat ? tag : this.formatTag(tag);
    this.currentTag.noTag = false;
  }

  public notag() {
    this.tag('', true);
    this.currentTag.noTag = true;
  }

  protected get noTag(): boolean {
    return this.currentTag.noTag;
  }

  public set label(label: string) {
    this.currentTag.labelId = label;
  }

  public get label() {
    return this.currentTag.labelId;
  }

  /**
   * @override
   */
  public formatUrl(id: string, base: string) {
    return base + '#' + encodeURIComponent(id);
  }

  /**
   * @override
   */
  public formatTag(tag: string) {
    return '(' + tag + ')';
  }

  /**
   * How to format ids for labelling equations.
   * @param {string} id The unique part of the id (e.g., label or number).
   * @return {string} The formatted id.
   */
  protected formatId(id: string) {
    return 'mjx-eqn-' + id.replace(/\s/g, '_');
  }

  /**
   * How to format numbers in tags.
   * @param {number} n The tag number.
   * @return {string} The formatted number.
   */
  protected formatNumber(n: number) {
    return n.toString();
  }

  // Tag handling functions.
  /**
   * @override
   */
  public autoTag() {
    if (this.currentTag.tag == null) {
      this.counter++;
      this.tag(this.counter.toString(), false);
    }
  }


  /**
   * @override
   */
  public clearTag() {
    this.label = '';
    this.tag(null, true);
    this.currentTag.tagId = '';
  }


  /**
   * @override
   */
  public getTag(force: boolean = false) {
    if (force) {
      this.autoTag();
      return this.makeTag();
    }
    const ct = this.currentTag;
    if (ct.taggable && !ct.noTag) {
      if (ct.defaultTags) {
        this.autoTag();
      } else {
        return null;
      }
      return this.makeTag();
    }
    return null;
  }

  public reset(n: number, keepLabels: boolean) {
    this.offset = (n || 0);
    this.history = [];
    if (!keepLabels) {
      this.labels = {};
      this.ids = {};
    }
  }

  public finalize(node: MmlNode, env: EnvList): MmlNode {
    return node;
  }

  /**
   * @override
   */
  public enTag = function(node: MmlNode, tag: MmlNode): MmlNode {
    let cell = TreeHelper.createNode('mtd', [node], {});
    let row = TreeHelper.createNode('mlabeledtr', [tag, cell], {});
    let table = TreeHelper.createNode('mtable', [row], {
      side: this.configuration.options.get('TagSide'),
      minlabelspacing: this.configuration.options.get('TagIndent'),
      displaystyle: true
    });
    return table;
  };


  /**
   * Sets the tag id.
   */
  private makeId() {
    // TODO: Test for uniqueness.
    this.currentTag.tagId = this.formatId(
      this.configuration.options.get('useLabelIds') ?
        (this.label || this.currentTag.tag) : this.currentTag.tag);
  }


  /**
   * @return {MmlNode} The actual tag node as an mtd.
   */
  private makeTag() {
    this.makeId();
    if (this.label) {
      this.labels[this.label] = new Label(this.currentTag.tag, this.currentTag.tagId);
    }
    let mml = new TexParser('\\text{' + this.currentTag.tagFormat + '}', {},
                            this.configuration).mml();
    return TreeHelper.createNode('mtd', [mml], {id: this.currentTag.tagId});
  }

};


/**
 * No tags, except where explicitly set.
 * @constructor
 * @extends {AbstractTags}
 */
export class NoTags extends AbstractTags {

  /**
   * @override
   */
  public autoTag() {}

  /**
   * @override
   */
  public getTag() {
    return !this.currentTag.tag ? null : super.getTag();
  }

}


/**
 * Standard AMS style tagging.
 * @constructor
 * @extends {AbstractTags}
 */
export class AmsTags extends AbstractTags { }


/**
 * Tags every display formula. Exceptions are:
 * @constructor
 * @extends {AbstractTags}
 */
export class AllTags extends AbstractTags {

  /**
   * @override
   */
  public finalize(node: MmlNode, env: EnvList) {
    if (!env.display || this.history.find(
      function(x: TagInfo) { return x.taggable; })) {
      return node;
    }
    let tag = this.getTag(true);
    return this.enTag(node, tag);
  }

}


/**
 * Class interface for factory.
 * @interface
 */
export interface TagsClass {
  new (): Tags;
}


// Factory needs functionality to create one Tags object from an existing one
// to hand over label values, equation ids etc.
//
// 'AMS' for standard AMS numbering,
//  or 'all' for all displayed equations
export namespace TagsFactory {

  let tagsMapping = new Map<string, TagsClass>([
    ['default', AmsTags],
    ['none', NoTags],
    ['all', AllTags],
    ['AMS', AmsTags]
  ]);


  export let add = function(name: string, constr: TagsClass) {
    tagsMapping.set(name, constr);
  };

  export let create = function(name: string): Tags {
    let constr = tagsMapping.get(name) || tagsMapping.get('default');
    return new constr();
  };

  export let setDefault = function(name: string) {
    tagsMapping.set('default', tagsMapping.get(name));
  };

  export let getDefault = function() {
    return TagsFactory.create('default');
  };

}

// export let DefaultTags = TagsFactory.create('default');
