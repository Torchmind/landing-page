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
import {Point} from "./Point";

/**
 * 2D Vector
 *
 * Represents a Vector of direction within 2D space in the sense of a mathematical euclidean vector of certain length.
 *
 * @author <a href="mailto:johannesd@torchmind.com">Johannes Donath</a>
 * @see Point for a representation of coordinates within 2D space.
 */
export class Vector2 extends Point {

        public constructor(x : number, y : number, listener : (x : number, y : number) => boolean = null) {
                super(x, y, listener);
        }

        /**
         * {@inheritDoc}
         */
        public clone() : Vector2 {
                return new Vector2(this._x, this._y);
        }

        /**
         * Calculates the dot product of this vector and the passed vector.
         *
         * @param vector a vector.
         * @returns {number} a dot product.
         */
        public dot(vector : Vector2) : number {
                return ((this._x * vector.x) + (this._y * vector.y));
        }

        /**
         * Multiplies this vector's coordinates with the supplied factor.
         *
         * This method returns a reference to its parent instance and is thus chain-able.
         *
         * @param factor a factor.
         * @returns {Vector2} a reference to this vector.
         */
        public multiplyByFactor(factor : number) : Vector2 {
                return this.update(new Vector2((this._x * factor), (this._y * factor)));
        }

        /**
         * Multiplies this vector's coordinate with the factors stored within the supplied vector.
         *
         * This method returns a reference to its parent instance and is thus chain-able.
         *
         * @param vector a vector containing a set of factors.
         * @returns {Vector2} a reference to this vector.
         */
        public multiplyBy(vector : Vector2) : Vector2 {
                return this.update(new Vector2((this._x * vector.x), (this._y * vector.y)));
        }

        /**
         * {@inheritDoc}
         */
        public offsetBy(vector : Vector2) : Vector2 {
                super.offsetBy(vector);
                return this;
        }

        /**
         * {@inheritDoc}
         */
        public update(point : Point) : Vector2 {
                super.update(point);
                return this;
        }

        /* Getters & Setters */

        /**
         * Retrieves the overall length of this vector.
         *
         * @returns {number}
         */
        get length() : number {
                return Math.sqrt((Math.pow(this._x, 2) + Math.pow(this._y, 2)));
        }

        /**
         * Retrieves a copy of this vector which has been normalized to a single unit within 2D space.
         *
         * @returns {Vector2} a normalized vector.
         */
        get normalized() : Vector2 {
                const length : number = this.length;
                return new Vector2((this._x / length), (this._y / length));
        }
}
