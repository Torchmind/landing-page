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
import {SceneManager} from "./SceneManager";

/**
 * Scene
 *
 * Provides the base architecture for a single scene which is capable of maintaining a state and being rendered
 * on-screen.
 */
export interface Scene {

        /**
         * Draws a single frame.
         * @param ctx a canvas rendering context.
         * @param delta a floating point which describes the relation of draw calls to realtime seconds.
         */
        draw(ctx : CanvasRenderingContext2D, delta : number) : void;

        /**
         * Calculates the state for the next draw call.
         * @param manager a reference to the parent manager.
         * @param delta a floating point which describes the relation of draw calls to realtime seconds.
         */
        think(manager : SceneManager, delta : number) : void;
}
