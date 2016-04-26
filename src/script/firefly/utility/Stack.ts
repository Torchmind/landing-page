/*
 * Copyright 2016 Johannes Donath <johannesd@torchmind.com>
 * and other copyright owners as documented in the project's IP log.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * 	http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {Cloneable} from "./Cloneable";

/**
 * Stack
 *
 * Provides a stack of elements which follows the first-in last-out (FILO) concept.
 *
 * @author <a href="mailto:johannesd@torchmind.com">Johannes Donath</a>
 */
export class Stack<E> implements Cloneable {
        private _content : E[];

        public constructor(elements : E[] = []) {
                this._content = elements;
        }

        /**
         * {@inheritDoc}
         */
        public clone() : Stack<E> {
                return new Stack(this._content);
        }

        /**
         * Checks whether the stack is empty.
         *
         * @returns {boolean} true if empty, false otherwise.
         */
        public isEmpty() : boolean {
                return this.length == 0;
        }

        /**
         * Retrieves the last element within the stack.
         *
         * @returns {E} the last element.
         */
        public peek() : E {
                if (this.isEmpty()) {
                        return null;
                }

                return this._content[(this._content.length - 1)];
        }

        /**
         * Removes the last element from the stack and returns it.
         *
         * @returns {T} the last element.
         */
        public pop() : E {
                if (this.isEmpty()) {
                        throw new Error("Cannot pop an element off of an empty stack");
                }

                return this._content.pop();
        }

        /**
         * Pushes a new element to the last slot within the stack.
         *
         * @param element an element.
         */
        public push(element : E) : void {
                this._content.push(element);
        }

        /* === Getters & Setters === */

        /**
         * Retrieves the current stack length.
         *
         * @returns {number} a length.
         */
        get length() : number {
                return this._content.length;
        }
}
