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
import {Container} from "../container/Container";
import {Entity} from "../entity/Entity";
import {Scene} from "../scene/Scene";

/**
 * Entity Scene
 *
 * Provides a basic scene implementation which is capable of managing the lifecycle of a set of entities.
 *
 * @author <a href="mailto:johannesd@torchmind.com">Johannes Donath</a>
 */
export class EntityScene implements Scene {
        private _entities : Entity[] = [];

        /**
         * {@inheritDoc}
         */
        public draw(container : Container, delta : number) : void {
                for (var entity of this._entities) {
                        container.drawIsolated(entity, delta);
                }
        }

        /**
         * Removes an entity from the scene.
         *
         * @param entity an entity.
         */
        public remove(entity : Entity) : void {
                const index : number = this._entities.indexOf(entity);

                if (index == -1) {
                        throw new Error("No such element.");
                }

                this._entities.slice(index, 1);
        }

        /**
         * Spawns an entity within the scene.
         *
         * @param entity an entity.
         */
        public spawn(entity : Entity) : void {
                this._entities.push(entity);
        }

        /**
         * {@inheritDoc}
         */
        public think(container : Container, delta : number) : void {
                for (var entity of this._entities) {
                        entity.think(delta);

                        if (entity.isDead()) {
                                this.remove(entity);
                        }
                }
        }

        /* === Getters & Setters === */

        /**
         * Retrieves the amount of entities within the scene at this moment.
         *
         * @returns {number} an amount.
         */
        get length() : number {
                return this._entities.length;
        }
}
