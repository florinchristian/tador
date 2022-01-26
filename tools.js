import React, { useState } from 'react';

const useForceUpdate = () => {
    const [value, setValue] = useState(1);
    return () => setValue(value * -1);
};

const getAgeFromDate = date => {
    let now = new Date();
    let age = (now.getFullYear() - date.getFullYear());

    if (now.getMonth() < date.getMonth()) {
        age--;
    } else if (now.getMonth() == date.getMonth()) {
        if (now.getDate() < date.getDate()) {
            age--;
        }
    }

    return age;
};

export {
    getAgeFromDate,
    useForceUpdate
};