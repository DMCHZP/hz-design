import React, { useRef, useState, useLayoutEffect, useMemo } from 'react';
import styles from './index.module.less';

interface BottomCardProps {
	height: number | string;
}

type Status = 'min' | 'normal' | 'max';

let moveY = 0;
let startY = 0;

const throlle = (func: any, delay: number) => {
	let pre = new Date().getTime();
	return function (this: any, ...args: any[]) {
		const now = new Date().getTime();
		if (now - pre >= delay) {
			func.apply(this, args);
			pre = new Date().getTime();
		}
	};
};

const BottomCard = (props: BottomCardProps) => {
	const { height } = props;
	const [status, setStatus] = useState<Status>('min');
	const [transform, setTransform] = useState({});
	const cardRef = useRef<any>();

	const baseNum = 1 / 6;

	useLayoutEffect(() => {
		const y = getStatusTranslateY(status);
		setTransform({ transform: `translateY(${y}px)` });
	}, [height]);

	const onTouchStart = (e: any) => {
		const clientY = e.touches[0].clientY;
		startY = clientY;
	};

	const getStatusTranslateY = (status: Status): number => {
		let val = 0;
		if (status === 'min') {
			val = cardRef.current.clientHeight * (2 / 3);
		} else if (status === 'normal') {
			val = cardRef.current.clientHeight * (1 / 3);
		} else if (status === 'max') {
			val = 0;
		}
		return val;
	};

	const onTouchMove = (e: any) => {
		const y = e.touches[0].clientY;
		moveY = y - startY;
		const currentY = getStatusTranslateY(status);
		setTransform({
			transform: `translateY(${currentY + moveY}px)`
		});
	};

	const onTouchMoveThrolle = throlle(onTouchMove, 50);

	const onTouchEnd = (e: any) => {
		const deltaY = e.changedTouches[0].clientY - startY;
		const clintHeight = cardRef.current.clientHeight;
		const currentY = getStatusTranslateY(status);
		//max偏移量 = clientHeight*(1/6)
		//normal偏移量 = clientHeight*(1/6)+clientHeight*(1/3)
		const normalBase = clintHeight * baseNum + clintHeight * (1 / 3);
		const maxBase = clintHeight * baseNum;
		const res = currentY + deltaY;
		if (res <= maxBase) {
			const minY = getStatusTranslateY('max');
			setTransform({
				transform: `translateY(${minY}px)`
			});
			setStatus('max');
		} else if (res > maxBase && res <= normalBase) {
			const normalY = getStatusTranslateY('normal');
			setTransform({
				transform: `translateY(${normalY}px)`
			});
			setStatus('normal');
		} else {
			const maxY = getStatusTranslateY('min');
			setTransform({
				transform: `translateY(${maxY}px)`
			});
			setStatus('min');
		}

		moveY = 0;
		startY = 0;
		//
	};

	return (
		<div
			ref={cardRef}
			onTouchStart={onTouchStart}
			onTouchMove={onTouchMoveThrolle}
			onTouchEnd={onTouchEnd}
			className={styles.card}
			style={{ ...transform, height: height }}
		>
			111
		</div>
	);
};

export default BottomCard;
