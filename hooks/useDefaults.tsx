import { useEffect, useRef, useState } from 'react';

type DefaultValues = {
    [key: string]: any; //key value pairs, the ones that are not filled are overwritten
}

type AnyProps = {
    [key: string]: any;
}

// props are generally a dictionary. Doesn't work with destructured props!
// will cast the result to ensure type consistency
// caution, since this is a new state common state issues will apply. 
// E.g. access in destructor will not work without a ref (use ref version below instead)
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


// ref version of useDefaults - this can be accessed in the unmounting with props.current
// since everything would need the props.current access so only use if necessary
export function useDefaultsByRef<T>(props: T, defaultValues: DefaultValues) {
    if (!defaultValues) throw new Error("useDefaults - defaultValues is required");

    const propRef = useRef<T>(props);

    useEffect(() => {
        if (!props) propRef.current = { ...defaultValues } as T;
        else {
            const newProps = { ...props };
            for (const key in defaultValues) {
                if (newProps[key] === undefined) newProps[key] = defaultValues[key];
            }
            propRef.current = newProps as T;
        }
    }, [props]);
    return [propRef];
}
