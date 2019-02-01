import React from 'react';
import { Carousel, Spin } from 'antd';

import './index.scss';

const RichCarousel = (props) => {
    const { autoplay, autoplaySpeed, children, loading } = props;

    return (
        <Carousel autoplay={autoplay}
            autoplaySpeed={autoplaySpeed}
            pauseOnFocus
        >
            {loading ? <Spin /> : children}
        </Carousel>
    );
};

export default RichCarousel;