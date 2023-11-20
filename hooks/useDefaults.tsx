import { useEffect, useState } from 'react';

type DefaultValues = {
    [key: string]: any; //key value pairs, the ones that are not filled are overwritten
}

type AnyProps = {
    [key: string]: any;
}

// props are generally a dictionary. Doesn't work with destructured props!
// will cast the result to ensure type consistency
export function useDefaults<T>(props: AnyProps, defaultValues: DefaultValues) {
    if (!defaultValues) throw new Error("useDefaults - defaultValues is required")

    const [propsWithDefault, setPropsWithDefault] = useState(props);

    useEffect(() => {
        if (!props) {
            setPropsWithDefault({ ...defaultValues });
            return;
        }
        const newProps = { ...props };
        for (const key in defaultValues) {
            if (!newProps[key]) newProps[key] = defaultValues[key];
        }
        setPropsWithDefault(newProps);
    }, [props])

    return [propsWithDefault as T];
}
