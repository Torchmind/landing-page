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
import {Color} from "../utility/Color";
import {Dimensions} from "../space/Dimensions";
import {Point} from "../space/Point";
import {Sprite} from "../drawable/Sprite";
import {Drawable} from "../drawable/Drawable";
import {Vector2} from "../space/Vector2";

/**
 * Container
 *
 * Provides an abstraction layer to support different graphic context types such as WebGL or HTML 5 Canvas without the
 * need of direct interaction from within entities or scenes.
 *
 * @author <a href="mailto:johannesd@torchmind.com">Johannes Donath</a>
 */
export interface Container {

        /**
         * Represents the container bounds (as in width and height).
         */
        bounds : Dimensions;

        /**
         * Represents the center point within the container space.
         *
         * Note: The values within the returned representation are immutable.
         */
        center : Point;

        /**
         * Represents the currently selected fill color for draw calls.
         *
         * Note: This value may change when leaving a scope.
         */
        fillColor : Color;

        /**
         * Indicates whether all modifications are currently applied to the root scope and thus cannot be reverted by
         * calling {@link #pop()}
         */
        rootScope : boolean;

        /**
         * Represents the currently selected stroke color for draw calls.
         *
         * Note: This value may change when leaving a scope.
         */
        strokeColor : Color;

        /**
         * Adds a point to the path created using {@link #startPath()}.
         *
         * @param point a point.
         */
        addPoint(point : Point) : void;

        /**
         * Clears the container contents.
         */
        clear() : void;

        /**
         * Deletes all stored points in a path.
         */
        clearPath();

        /**
         * Adds a fill and stroke color to the current container (within the scope of the current state).
         *
         * @param color a color.
         */
        color(color : Color) : void;

        /**
         * Creates a sprite using the image located at the specified uri.
         *
         * Note: This operation is async as loading the resource may take some time. Additionally this method does not
         * circumvent any security checks in place within the browser and thus may return with an error due to CSP
         * or similar restrictions.
         *
         * @param uri a relative path or URL which points to the texture.
         */
        createSprite(uri : string) : Promise<Sprite>;

        /**
         * Draws a single drawable using the configuration within the current state.
         *
         * @param drawable a drawable.
         */
        draw(drawable : Drawable) : void;

        /**
         * Draws a single drawable within an isolated scope using the configuration within the current state.
         *
         * @param drawable a drawable.
         */
        drawIsolated(drawable : Drawable) : void;

        /**
         * Draws a circle at a specified point using the passed line thickness.
         *
         * @param r the circle radius.
         * @param thickness the line thickness.
         */
        drawCircle(r : number, thickness? : number) : void;

        /**
         * Draws a line between two points with the specified thickness.
         *
         * @param x the ending X-Coordinate.
         * @param y the ending Y-Coordinate.
         * @param thickness the line thickness.
         */
        drawLine(x : number, y : number, thickness? : number) : void;

        /**
         * Fills the path which has been added to the current state after {@link #startPath()} using
         * {@link addPoint(Point)}.
         */
        fillPath() : void;

        /**
         * Wraps the passed method in its own state by calling {@link #push()} before calling and {@link #pop()} after
         * the method has returned.
         *
         * @param func a method.
         */
        isolate(func : () => void) : void;

        /**
         * Pops a new state off of the stack and restores the state previously contained within the container.
         */
        pop() : void;

        /**
         * Pushes a new state onto the stack which is remembered even when transformations or rotations are applied.
         * This state is automatically reverted when {@link #pop()} is called.
         */
        push() : void;

        /**
         * Adds a rotation to the current container (within the scope of the current state as created by
         * {@link #push()}).
         *
         * @param angle an angle (in degrees).
         */
        rotate(angle : number) : void;

        /**
         * Indicates the start of a new path.
         *
         * Note: Only one path can be drawn at once. This method will throw an error when called twice without calling
         * a draw method like {@link #strokePath()} or {@link #fillPath()} in between.
         */
        startPath() : void;

        /**
         * Strokes the path which has been added to the current state after {@link #startPath()} using
         * {@link addPoint(Point)}.
         */
        strokePath() : void;

        /**
         * Adds a translation to the current container (within the scope of the current state as created by
         * {@link #push()}).
         *
         * @param vector an offset.
         */
        translate(vector : Vector2) : void;
}
