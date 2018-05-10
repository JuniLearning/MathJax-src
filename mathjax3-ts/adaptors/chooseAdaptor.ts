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
 * @fileoverview  Chooses between jdsom and browser DOM adaptors
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {liteAdaptor, LiteAdaptor} from './liteAdaptor.js';
import {browserAdaptor} from './browserAdaptor.js';
import {HTMLAdaptor} from './htmlAdaptor.js';

let choose;

try {
    document;  // errors if not in browser
    choose = browserAdaptor;
} catch(e) {
    choose = liteAdaptor;
}

/*
 * Function to selecting which adaptor to use (depending on whether we are in a browser of node.js)
 */
export const chooseAdaptor = choose;