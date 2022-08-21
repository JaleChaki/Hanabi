import React, {Fragment, useState} from 'react';

export const Counter = () => {
    const [currentCount, setCurrentCount] = useState(0);

    return (
        <Fragment>
            <h1>Counter</h1>

            <p>This is a simple example of a React component.</p>

            <p aria-live="polite">Current count: <strong>{currentCount}</strong></p>

            <button className="btn btn-primary" onClick={() => setCurrentCount(currentCount + 1)}>Increment</button>
        </Fragment>
    );
}
