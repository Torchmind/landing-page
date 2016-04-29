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
import {Container} from "./Container";
import {Point} from "../space/Position";
import {Color} from "../utility/Color";
import {Sprite} from "../drawable/Sprite";
import {Drawable} from "../drawable/Drawable";
import {Dimensions} from "../space/Dimensions";
import {Stack} from "../utility/Stack";
import {Vector2} from "../space/Position";

/**
 * Canvas Container
 *
 * Provides a container implementation which utilizes the HTML 5 canvas element to draw its shapes.
 *
 * @author <a href="mailto:johannesd@torchmind.com">Johannes Donath</a>
 */
export class CanvasContainer implements Container {
        private _canvas : HTMLCanvasElement;
        private _ctx : CanvasRenderingContext2D;

        private _bounds : Dimensions;
        private _fillColor : Color;
        private _strokeColor : Color;

        private _state : Stack<State> = new Stack<State>();
        private _path : Stack<Point> = null;

        constructor(element : HTMLCanvasElement) {
                this._canvas = element;
                this._ctx = this._canvas.getContext("2d");

                this._bounds = new Dimensions(this._canvas.width, this._canvas.height, (width, height) => {
                        this._canvas.width = width;
                        this._canvas.height = height;

                        return true;
                });

                const fillColorListener = (color : Color) => {
                        if (!this._state.isEmpty()) {
                                const previousColor : Color = this._fillColor.clone();

                                this._state.peek().add(() => {
                                        this._fillColor = previousColor.hook(fillColorListener);
                                        this._ctx.fillStyle = previousColor.rgb;
                                });
                        }

                        this._ctx.fillStyle = color.rgb;
                        return true;
                };

                const strokeColorListener = (color : Color) => {
                        if (!this._state.isEmpty()) {
                                const previousColor : Color = this._strokeColor.clone();

                                this._state.peek().add(() => {
                                        this._strokeColor = previousColor.hook(strokeColorListener);
                                        this._ctx.strokeStyle = previousColor.rgb;
                                });
                        }

                        this._ctx.strokeStyle = color.rgb;
                        return true;
                };

                this._fillColor = new Color(0, 0, 0, 255, fillColorListener);
                this._strokeColor = new Color(0, 0, 0, 255, strokeColorListener);

                this._ctx.fillStyle = this._fillColor.rgb;
                this._ctx.strokeStyle = this._strokeColor.rgb;
        }

        /**
         * {@inheritDoc}
         */
        public addPoint(point : Point) : void {
                if (this._path == null) {
                        throw new Error("Cannot add point to path: No path");
                }

                this._path.push(point.clone());
        }

        /**
         * {@inheritDoc}
         */
        public clear() : void {
                this._ctx.clearRect(0, 0, this._bounds.width, this._bounds.height);
        }

        /**
         * {@inheritDoc}
         */
        public clearPath() {
                this._path = null;
        }

        /**
         * {@inheritDoc}
         */
        public color(color : Color) : void {
                this.fillColor = color;
                this.strokeColor = color;
        }

        /**
         * {@inheritDoc}
         */
        public createSprite(uri : string) : Promise<Sprite> {
                return new Promise<Sprite>((resolve, reject) => {
                        const img = <HTMLImageElement> new Image();
                        img.src = uri;

                        img.onload = () => {
                                resolve(new CanvasSprite(img, this, this._ctx));
                        };

                        img.onerror = () => {
                                reject();
                        };
                });
        }

        /**
         * {@inheritDoc}
         */
        public drawIsolated(drawable : Drawable, delta : number) : void {
                this.isolate(() => {
                        drawable.draw(this, delta);
                });
        }

        /**
         * Draws the currently stored path within the canvas context.
         */
        protected drawPath() : void {
                if (this._path == null) {
                        throw new Error("Cannot draw empty path.");
                }

                this._ctx.beginPath();
                {
                        while(!this._path.isEmpty()) {
                                const point : Point = this._path.pop();
                                this._ctx.lineTo(point.x, point.y);
                        }
                }
                this._path = null;
        }

        /**
         * {@inheritDoc}
         */
        public drawCircle(r : number, thickness : number = 1) : void {
                this._ctx.beginPath();
                this._ctx.arc(0, 0, r, 0, (2 * Math.PI), false);
                this._ctx.stroke();
        }

        /**
         * {@inheritDoc}
         */
        public drawLine(x : number, y : number, thickness : number = 1) : void {
                this._ctx.lineWidth = thickness;
                this._ctx.lineTo(x, y);
        }

        /**
         * {@inheritDoc}
         */
        drawText(text : string, font : string = '18px Helvetica', alignment : string = 'center') : void {
                this._ctx.font = font;
                this._ctx.textAlign = alignment;
                this._ctx.fillText(text, 0, 0);
        }

        /**
         * {@inheritDoc}
         */
        public fillPath() : void {
                this.drawPath();
                this._ctx.fill();
        }

        /**
         * {@inheritDoc}
         */
        public isolate(func : () => void) : void {
                this.push();
                {
                        func();
                }
                this.pop();
        }

        /**
         * {@inheritDoc}
         */
        public pop() : void {
                this._state.pop().revert(this._ctx);
        }

        /**
         * {@inheritDoc}
         */
        public push() : void {
                this._state.push(new State());
        }

        /**
         * {@inheritDoc}
         */
        public rotate(angle : number) : void {
                this._ctx.rotate(Vector2.toRadians(angle));

                if (!this._state.isEmpty()) {
                        this._state.peek().add(() => {
                                this._ctx.rotate(-Vector2.toRadians(angle));
                        })
                }
        }

        /**
         * {@inheritDoc}
         */
        public startPath() : void {
                if (this._path != null) {
                        throw new Error("A path is already active.");
                }

                this._path = new Stack<Point>();
        }

        /**
         * {@inheritDoc}
         */
        public strokePath() : void {
                this.drawPath();
                this._ctx.stroke();
        }

        /**
         * {@inheritDoc}
         */
        public translate(vector : Vector2) : void {
                this._ctx.translate(vector.x, vector.y);

                if (!this._state.isEmpty()) {
                        this._state.peek().add(() => {
                                this._ctx.translate(-vector.x, -vector.y);
                        });
                }
        }

        /* == Getters & Setters == */

        /**
         * Retrieves the container bounds.
         *
         * @returns {Dimensions} a bounds representation.
         */
        get bounds() : Dimensions {
                return this._bounds;
        }

        /**
         * Sets the container bounds.
         *
         * @param dimensions a bounds representation.
         */
        set bounds(dimensions : Dimensions) {
                this._bounds.update(dimensions);
        }

        /**
         * Retrieves the container center.
         *
         * @returns {Point} a center point.
         */
        get center() : Point {
                return (new Point(this._bounds.width / 2, this._bounds.height / 2)).immutable();
        }

        /**
         * Retrieves the current fill color.
         *
         * @returns {Color} a fill color.
         */
        get fillColor() : Color {
                return this._fillColor;
        }

        /**
         * Sets the current fill color.
         *
         * @param color a fill color.
         */
        set fillColor(color : Color) {
                this._fillColor.update(color);
        }

        /**
         * Checks whether there is currently no scope on the stack.
         *
         * @returns {boolean} true if root scope, false otherwise.
         */
        get rootScope() : boolean {
                return this._state.isEmpty();
        }

        /**
         * Retrieves the current stroke color.
         *
         * @returns {Color} a stroke color.
         */
        get strokeColor() : Color {
                return this._strokeColor;
        }

        /**
         * Sets the current stroke color.
         *
         * @param color a stroke color.
         */
        set strokeColor(color : Color) {
                this._strokeColor.update(color);
        }
}

/**
 * Canvas Sprite
 *
 * Represents a drawable sprite.
 */
class CanvasSprite implements Sprite {
        private _container : CanvasContainer;
        private _ctx : CanvasRenderingContext2D;
        private _image : HTMLImageElement;

        private _bounds : Dimensions;
        private _center : Point;
        private _pivot : Point;

        public constructor(img : HTMLImageElement, container : CanvasContainer, ctx : CanvasRenderingContext2D) {
                this._image = img;
                this._container = container;
                this._ctx = ctx;

                this._bounds = new Dimensions(img.width, img.height);
                this._center = new Point((img.width / 2), (img.height / 2));
                this._pivot = new Point(0.5, 0.5);
        }

        /**
         * {@inheritDoc}
         */
        public draw(scale : number = 1) : void {
                this._container.isolate(() => {
                        this._ctx.globalAlpha = this._container.fillColor.alpha / 255;

                        var scaledBounds : Dimensions = new Dimensions((this._bounds.width * scale), (this._bounds.height * scale));

                        this._container.translate((scaledBounds.end.multiplyBy(this._pivot.toVector()).multiplyByFactor(-1)));
                        this._ctx.drawImage(this._image, 0, 0, (this._bounds.width * scale), (this._bounds.height * scale));

                        this._ctx.globalAlpha = 1.0;
                });
        }

        /**
         * Retrieves a set of image dimensions.
         *
         * @returns {Dimensions}
         */
        get bounds() : Dimensions {
                return this._bounds.immutable();
        }

        /**
         * Retrieves an image center.
         *
         * @returns {Point}
         */
        get center() : Point {
                return this._center.immutable();
        }

        /**
         * Retrieves a pivot point to use as a reference point when drawing.
         *
         * @returns {Point}
         */
        get pivot() : Point {
                return this._pivot.immutable();
        }

        /**
         * Sets the pivot point.
         *
         * @param value
         */
        set pivot(value : Point) {
                this._pivot = value;
        }
}

/**
 * Container State
 *
 * Represents a single state that can be applied to or reverted from a container.
 */
class State {
        private _updates : Stack<(ctx : CanvasRenderingContext2D) => void> = new Stack<(ctx : CanvasRenderingContext2D) => void>();

        public add(callback : () => void) : void {
                this._updates.push(callback);
        }

        /**
         * Reverts a state change from the container.
         *
         * @param ctx a canvas context.
         */
        public revert(ctx : CanvasRenderingContext2D) : void {
                while (!this._updates.isEmpty()) {
                        this._updates.pop()(ctx);
                }
        }
}
