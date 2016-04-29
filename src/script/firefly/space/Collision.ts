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
import {Dimensions} from "./Dimensions";
import {Entity} from "../entity/Entity";
import {Vector2, Point} from "./Position";

/**
 * Collision
 *
 * Represents an object collision (in form of a cricle).
 *
 * @author <a href="mailto:johannesd@torchmind.com">Johannes Donath</a>
 */
export class Collision {
        private _entity : Entity;
        private _radius : number;
        private _pivot : Point;

        public constructor(entity : Entity, radius : number, pivot : Point = new Point(0.5, 0.5)) {
                this._entity = entity;
                this._radius = radius;
                this._pivot = pivot;
        }

        /**
         * Checks whether this collision collides with another entity.
         *
         * @param entity an entity.
         * @returns {boolean} if true collides, false otherwise.
         */
        public collide(entity : Entity) : boolean {
                const collision : Collision = entity.collision;

                if (collision == null) {
                        return false;
                }

                const dx : number = this.center.x - collision.center.x;
                const dy : number = this.center.y - collision.center.y;

                const distance : number = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

                return (distance < (this._radius + collision.radius));
        }

        /* === Getters & Setters === */

        /**
         * Retrieves the collision bounds (as a rectangle).
         *
         * @returns {Dimensions}
         */
        get bounds() : Dimensions {
                return new Dimensions((this._radius * 2), (this._radius * 2));
        }

        /**
         * Retrieves the center position of this collision.
         *
         * @returns {Point} a center point.
         */
        get center() : Point {
                return this._entity.position.clone().offsetBy(this.bounds.end.clone().multiplyBy(this._pivot.toVector()).multiplyByFactor(-1));
        }

        /**
         * Retrieves the collision radius.
         *
         * @returns {number} a radius.
         */
        get radius() : number {
                return this._radius;
        }

        /**
         * Sets a collision radius.
         * @param value a radius.
         */
        set radius(value : number) {
                this._radius = value;
        }

        /**
         * Retrieves the collision's pivot point.
         *
         * @returns {Point}
         */
        get pivot() : Point {
                return this._pivot;
        }

        /**
         * Sets the collisions pivot point.
         *
         * @param value
         */
        set pivot(value : Point) {
                this._pivot = value;
        }
}
