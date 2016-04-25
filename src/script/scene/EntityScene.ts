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
import {Scene} from "./Scene";
import {SceneManager} from "./SceneManager";
import {DrawableEntity} from "../drawable/entity/DrawableEntity";

/**
 * Entity Scene
 *
 * Provides a scene implementation which utilizes entities and other drawables for its purposes.
 */
export abstract class EntityScene implements Scene {
        private _entities : DrawableEntity[] = [];

        /**
         * {@inheritDoc}
         */
        public draw(ctx : CanvasRenderingContext2D) : void {
                for (let entity of this._entities) {
                        entity.draw(ctx);
                }
        }

        /**
         * {@inheritDoc}
         */
        public think(manager : SceneManager) : void {
                for (let entity of this._entities) {
                        entity.think();
                }
        }

        /**
         * Spawns a new entity within the scene.
         * @param entity an entity.
         */
        public spawn(entity : DrawableEntity) {
                this._entities.push(entity);
        }

        /**
         * Removes an entity from the scene.
         * @param entity an entity.
         */
        public kill(entity : DrawableEntity) {
                this._entities.slice(this._entities.indexOf(entity), 1);
        }

        protected get entities() : DrawableEntity[] {
                return this._entities;
        }
}
