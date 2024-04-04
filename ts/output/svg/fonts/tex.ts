/*************************************************************
 *
 *  Copyright (c) 2017-2022 The MathJax Consortium
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
 * @fileoverview  The MathJax TeXFont object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVGFontData, SVGFontDataClass, SVGCharOptions, SVGVariantData, SVGDelimiterData,
        DelimiterMap, CharMapMap} from '../FontData.js';
import {CommonTeXFontMixin} from '../../common/fonts/tex.js';
import {OptionList} from '../../../util/Options.js';

import {normal} from './tex/normal.js';
import {delimiters} from '../../common/fonts/tex/delimiters.js';

/***********************************************************************************/
/**
 *  The TeXFont class
 */
export class TeXFont extends
CommonTeXFontMixin<SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontDataClass>(SVGFontData) {

  /**
   *  The stretchy delimiter data
   */
  protected static defaultDelimiters: DelimiterMap<SVGDelimiterData> = delimiters;

  /**
   *  The character data by variant
   */
  protected static defaultChars: CharMapMap<SVGCharOptions> = {
    'normal': normal,
  };

  /**
   * The cacheIDs to use for the variants in font-caching
   */
  protected static variantCacheIds: {[name: string]: string} = {
    'normal': 'N',
  };

  /**
   * @override
   */
  constructor(options: OptionList = null) {
    super(options);
    //
    //  Add the cacheIDs to the variants
    //
    const CLASS = this.constructor as typeof TeXFont;
    for (const variant of Object.keys(CLASS.variantCacheIds)) {
      this.variant[variant].cacheID = 'TEX-' + CLASS.variantCacheIds[variant];
    }
  }

}
