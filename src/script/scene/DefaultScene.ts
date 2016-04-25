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
import {EntityScene} from "./EntityScene";
import {SceneManager} from "./SceneManager";
import {LineEntity} from "../drawable/entity/LineEntity";

/**
 * Default Scene
 *
 * Provides a seen with a few random elements in the background.
 */
export class DefaultScene extends EntityScene {

        public constructor(manager : SceneManager) {
                super(manager);

                for (var i : number = 0; i < this.getEntityAmount(manager); ++i) {
                        this.spawn(new LineEntity(manager));
                }
        }

        /**
         * {@inheritDoc}
         */
        public think(manager : SceneManager) : void {
                super.think(manager);

                while (this.entities.length < this.getEntityAmount(manager)) {
                        this.spawn(new LineEntity(manager));
                }
        }

        /**
         * Retrieves the maximum amount of entities in respect to the screen resolution.
         * @param manager a reference to the scene manager. 100 = x * width * height
         * @returns {number} an amount.
         */
        protected getEntityAmount(manager : SceneManager) : number {
                return Math.ceil(0.00006 * manager.bounds.x * manager.bounds.y);
        }
}
