import React, { useRef, useState, useMemo } from "react";
import { BoardProps } from "../comps/board/Board";
import styles from "./MobileScene.module.css";

export type DragSelectData = {
	isMouseDown: boolean;
	dimSelected: number;
	deselecting: boolean;
};

export type MobileSceneProps = BoardProps & {
	aspectRatio?: number;
};

const computedStyles = getComputedStyle(document.documentElement);
const unselectedFg = computedStyles.getPropertyValue("--unselected-fg").trim();
const selectedFg = computedStyles.getPropertyValue("--selected-fg").trim();
const selectedBg = computedStyles.getPropertyValue("--selected-bg").trim();
const boardColor = computedStyles.getPropertyValue("--board-color").trim();
const boardOpacity = +computedStyles.getPropertyValue("--board-opacity").trim();

// Helper to get SVG coordinates from cell data
function getVertexCoords(vertex, gridSize = 40, boardSize = 3) {
	// vertex.point: [x, y, z] (use x, z for 2D)
	return {
		cx: (vertex.point[0]) * gridSize,
		cy: -(vertex.point[2]) * gridSize,
	};
}

export default function MobileScene({
	stepIndex,
	editComplex,
	viewOptions,
	complex,
	editOptions,
	allowEditing,
	aspectRatio = 1,
}: MobileSceneProps) {
	const gridSize = 40;
	const gridExtent = 3;
	const svgSize = gridSize * gridExtent * 2;

	// Preview position for adding a vertex
	const [previewPosition, setPreviewPosition] = useState<[number, number, number] | null>(null);

	// Memoize selected cells
	const selectedVertices = useMemo(() => [...editComplex.selected].filter(s => s.dimension === 0), [editComplex.selected]);
	const selectedEdges = useMemo(() => [...editComplex.selected].filter(s => s.dimension === 1), [editComplex.selected]);
	const selectedFaces = useMemo(() => [...editComplex.selected].filter(s => s.dimension === 2), [editComplex.selected]);

	// Grid lines
	const gridLines = useMemo(() => {
		const lines = [];
		for (let i = -gridExtent; i <= gridExtent; i++) {
			// Vertical
			lines.push({ x1: i*gridSize, y1: -svgSize/2, x2: i*gridSize, y2: svgSize/2 });
			// Horizontal
			lines.push({ x1: -svgSize/2, y1: i*gridSize, x2: svgSize/2, y2: i*gridSize });
		}
		return lines;
	}, [gridSize, gridExtent, svgSize]);

	// Cell event handlers
	function handleVertexClick(vertex) {
		if (!allowEditing) return;
		editComplex.toggleRepSelection(vertex.key);
	}

	function handleSvgPointerMove(e: React.PointerEvent<SVGSVGElement>) {
		if (!allowEditing || editOptions.mode !== "add") return;
		const rect = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const gridX = Math.round((x/2 - svgSize/2 + gridSize / 4) / gridSize );
		const gridZ = -Math.round((y/2 - svgSize/2+ gridSize / 4) / gridSize);
		//if (!previewPosition || previewPosition[0] !== gridX || previewPosition[2] !== gridZ) {
			setPreviewPosition([gridX, 0, gridZ]);
		//}
	}

	function handleSvgPointerOut() {
		if (!allowEditing) return;
		setPreviewPosition(null);
	}

	function handleSvgClick(e) {
		// if (!allowEditing || editOptions.mode !== "add" || !previewPosition) return;
		editComplex.addVertex(previewPosition);
		setPreviewPosition(null);
	}

	// Render faces (as polygons)
	function renderFaces() {
		return complex.cells[2]?.map(face => {
			const points = face.vertices.map(v => {
				const { cx, cy } = getVertexCoords(v, gridSize, svgSize/2);
				return `${cx},${cy}`;
			}).join(" ");
			const isSelected = selectedFaces.some(f => f.key === face.key);
			return (
				<polygon
					key={face.key}
					points={points}
					fill={isSelected ? selectedBg : boardColor}
					opacity={boardOpacity}
					stroke={isSelected ? selectedFg : unselectedFg}
					strokeWidth={2}
				/>
			);
		});
	}

	// Render edges (as lines)
	function renderEdges() {
		return complex.cells[1]?.map(edge => {
			const v0 = getVertexCoords(edge.vertices[0], gridSize, svgSize/2);
			const v1 = getVertexCoords(edge.vertices[1], gridSize, svgSize/2);
			const isSelected = selectedEdges.some(e => e.key === edge.key);
			return (
				<line
					key={edge.key}
					x1={v0.cx}
					y1={v0.cy}
					x2={v1.cx}
					y2={v1.cy}
					stroke={isSelected ? selectedFg : unselectedFg}
					strokeWidth={3}
					opacity={boardOpacity}
				/>
			);
		});
	}

	// Render vertices (as circles)
	function renderVertices() {
		return complex.cells[0]?.map(vertex => {
			const { cx, cy } = getVertexCoords(vertex, gridSize, svgSize/2);
			const isSelected = selectedVertices.some(v => v.key === vertex.key);
			return (
				<circle
					key={vertex.key}
					cx={cx}
					cy={cy}
					r={12}
					fill={isSelected ? selectedFg : unselectedFg}
					stroke={isSelected ? selectedBg : boardColor}
					strokeWidth={3}
					onPointerDown={() => handleVertexClick(vertex)}
					style={{ cursor: allowEditing ? "pointer" : "default" }}
				/>
			);
		});
	}

	
	return (
		<>
		{previewPosition}123
			<svg
				width={svgSize}
				height={svgSize}
				onPointerDown={handleSvgClick}
				onPointerMove={handleSvgPointerMove}
				onPointerOut={handleSvgPointerOut}
				viewBox={`${-svgSize/2} ${-svgSize/2} ${svgSize} ${svgSize}`}
				className={styles.svg}
			>
				{/* Grid */}
				{gridLines.map((line, i) => (
					<line
						key={i}
						x1={line.x1}
						y1={line.y1}
						x2={line.x2}
						y2={line.y2}
						stroke="#ccc"
						strokeWidth={1}
					/>
				))}
				{/* Faces */}
				{renderFaces()}
				{/* Edges */}
				{renderEdges()}
				{/* Vertices */}
				{renderVertices()}
				{/* Preview vertex */}
				{previewPosition && editOptions.mode === "add" && (
					<circle
						cx={previewPosition[0]*gridSize}
						cy={-previewPosition[2]*gridSize}
						r={12}
						fill={unselectedFg}
						opacity={0.5}
						stroke={boardColor}
						strokeWidth={2}
					/>
				)}
			</svg>
		</>
	);
}
