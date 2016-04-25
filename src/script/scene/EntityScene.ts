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
import {Color} from "../drawable/Color";

/**
 * Entity Scene
 *
 * Provides a scene implementation which utilizes entities and other drawables for its purposes.
 */
export abstract class EntityScene implements Scene {
        private _manager : SceneManager;
        private _entities : DrawableEntity[] = [];

        constructor(manager : SceneManager) {
                this._manager = manager;
        }

        /**
         * {@inheritDoc}
         */
        public draw(ctx : CanvasRenderingContext2D, delta : number) : void {
                for (let entity of this._entities) {
                        const color : Color = this._manager.color.clone();
                        color.alpha *= entity.getVisibility();

                        ctx.strokeStyle = color.string;
                        ctx.fillStyle = color.string;
                        entity.draw(ctx, delta);

                        ctx.restore();
                }
        }

        /**
         * {@inheritDoc}
         */
        public think(manager : SceneManager, delta : number) : void {
                for (let entity of this._entities) {
                        entity.think(delta);

                        if (entity.isDead()) {
                                this.kill(entity);
                        }
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
                const index : number = this._entities.indexOf(entity);

                if (index == -1) {
                        throw new Error("Entity is not in list");
                }

                entity.health = 0;
                this._entities.splice(index, 1);
        }

        protected get entities() : DrawableEntity[] {
                return this._entities;
        }
}
