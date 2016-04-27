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
import {Vector2} from "./Vector2";

/**
 * Point
 *
 * Represents a set of coordinates which describe a certain location in two dimensional space.
 *
 * @author <a href="mailto:johannesd@torchmind.com">Johannes Donath</a>
 */
export class Point implements Cloneable {
        protected _x : number;
        protected _y : number;
        protected _listener : (x : number, y : number) => boolean;

        public constructor(x : number, y : number, listener : (x : number, y : number) => boolean = null) {
                this._x = x;
                this._y = y;
                this._listener = listener;
        }

        /**
         * {@inheritDoc}
         */
        public clone() : Point {
                return new Point(this._x, this._y, this._listener);
        }

        /**
         * Checks whether the supplied point is equal to this point.
         *
         * @param that the point to compare to.
         * @returns {boolean} true if equal, false otherwise.
         */
        public equals(that : Point) : boolean {
                if (that == null || that == undefined) {
                        return false;
                }

                return that == this || (this._x == that.x && this._y == that.y);
        }

        /**
         * Creates an immutable copy of this point.
         *
         * @returns {Point} an immutable point.
         */
        public immutable() : Point {
                return new Point(this._x, this._y, (x, y) => {
                        return false;
                });
        }

        /**
         * Offsets this points coordinates by the amount and direction represented by the supplied vector.
         *
         * This method returns a reference to its parent instance and is thus chain-able.
         *
         * @param vector a vector to offset by.
         * @returns {Point} a reference to this point.
         */
        public offsetBy(vector : Vector2) : Point {
                return this.update(new Point((this._x + vector.x), (this._y + vector.y)));
        }

        /**
         * Converts a point into a vector which is relative to the virtual space origin.
         *
         * @returns {Vector2} a vector.
         */
        public toVector() : Vector2 {
                return new Vector2(this._x, this._y);
        }

        /**
         *
         * Updates this point's coordinates using the coordinates supplied by the passed point.
         *
         * Note: Passing a value to this setter is not guaranteed to actually alter the internal values as a listener
         * may reject the supplied value.
         *
         * This method returns a reference to its parent instance and is thus chain-able.
         *
         * @param point a reference to a point to poll the coordinates from.
         * @returns {Point} a reference to this point.
         */
        public update(point : Point) : Point {
                if (!this.equals(point) && this._listener != null) {
                        if (!this._listener(point.x, point.y)) {
                                return this;
                        }
                }

                this._x = point.x;
                this._y = point.y;

                return this;
        }

        /* Getters & Setters */

        /**
         * Retrieves this point's X-Coordinate.
         *
         * @returns {number} an X-Coordinate.
         */
        get x() : number {
                return this._x;
        }

        /**
         * Sets this point's X-Coordinate.
         *
         * Note: Passing a value to this setter is not guaranteed to actually alter the internal value as a listener may
         * reject the supplied value.
         *
         * @param value a new X-Coordinate.
         */
        set x(value : number) {
                if (this._x != value && this._listener != null) {
                        if (!this._listener(value, this._y)) {
                                return;
                        }
                }

                this._x = value;
        }

        /**
         * Retrieves the point's Y-Coordinate.
         *
         * @returns {number} a Y-Coordinate.
         */
        get y() : number {
                return this._y;
        }

        /**
         * Sets this point's Y-Coordinate.
         *
         * Note: Passing a value to this setter is not guaranteed to actually alter the internal value as a listener may
         * reject the supplied value.
         *
         * @param value a new Y-Coordinate.
         */
        set y(value : number) {
                if (this._y != value && this._listener != null) {
                        if (!this._listener(this._x, value)) {
                                return;
                        }
                }

                this._y = value;
        }

        /* Constants */

        /**
         * Retrieves the exact location of the coordinate system origin.
         *
         * @returns {Point}
         * @constructor
         */
        static get ORIGIN() {
                return new Point(0, 0);
        }
}
