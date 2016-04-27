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
import {Cloneable} from "../utility/Cloneable";
import {Vector2} from "./Position";

/**
 * Dimensions
 *
 * Provides a representation of the absolute dimensions of an element within or outside of a container such as an HTML 5
 * canvas container.
 *
 * @author <a href="mailto:johannesd@torchmind.com">Johannes Donath</a>
 */
export class Dimensions implements Cloneable {
        private _height : number;
        private _width : number;
        private _listener : (width : number, height : number) => boolean;

        public constructor(width : number, height : number, listener : (width : number, height : number) => boolean = null) {
                this._width = width;
                this._height = height;
                this._listener = listener;
        }

        /**
         * {@inheritDoc}
         */
        public clone() : Dimensions {
                return new Dimensions(this._width, this._height);
        }

        /**
         * Checks whether the supplied set of dimensions are equal to the dimensions represented by this instance.
         *
         * @param dimensions a set of dimensions to compare to.
         * @returns {boolean} true if equal, false otherwise.
         */
        public equals(dimensions : Dimensions) : boolean {
                if (dimensions == null || dimensions == undefined) {
                        return false;
                }

                return this == dimensions || (this._width == dimensions.height && this._height == dimensions.height);
        }

        /**
         * Creates an immutable copy of this set of dimensions.
         *
         * @returns {Dimensions} an immutable copy.
         */
        public immutable() : Dimensions {
                return new Dimensions(this._width, this._height, (width, height) => {
                        return false;
                });
        }

        /**
         * Converts this instance into a human readable string which may be used for logging purposes.
         * @returns {string} a string representation.
         */
        public toString() : string {
                return this._width + 'x' + this._height;
        }

        /**
         * Updates the width and height of this instance using the values provided by the supplied set of dimensions.
         *
         * Note: This method returns a reference to its parent instance and is thus chain-able.
         *
         * @param dimensions an instance to pull the new values from.
         * @returns {Dimensions} a reference to this instance.
         */
        public update(dimensions : Dimensions) : Dimensions {
                if (!this.equals(dimensions) && this._listener != null) {
                        if (!this._listener(dimensions.width, dimensions.height)) {
                                return this;
                        }
                }

                this._width = dimensions.width;
                this._height = dimensions.height;

                return this;
        }

        /* == Getters & Setters == */

        /**
         * Retrieves a vector which points to the end of the dimensions described by this instance.
         *
         * @returns {Vector2} an end offset vector.
         */
        get end() : Vector2 {
                return new Vector2(this._width, this._height);
        }

        /**
         * Retrieves the current element height.
         *
         * @returns {number} a height.
         */
        get height() : number {
                return this._height;
        }

        /**
         * Sets the current element height.
         *
         * @param value a new height.
         */
        set height(value : number) {
                if (this._height != value && this._listener != null) {
                        if (!this._listener(value, this._height)) {
                                return;
                        }
                }

                this._height = value;
        }

        /**
         * Retrieves the current element width.
         *
         * @returns {number} a width.
         */
        get width() : number {
                return this._width;
        }

        /**
         * Sets the current element width.
         *
         * @param value a new width.
         */
        set width(value : number) {
                if (this._width != value && this._listener != null) {
                        if (!this._listener(this._width, value)) {
                                return;
                        }
                }

                this._width = value;
        }
}
