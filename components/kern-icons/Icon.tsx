import { memo } from 'react';
import type { ComponentType } from 'react';

type IconProps = {
    className?: string;
    Icon: ComponentType<{ className?: string, 'aria-hidden'?: boolean, size?: number, strokeWidth?: number }>;
};

const Icon = memo(({ Icon, className }: IconProps) => (
    <Icon className={className} />
));

export default Icon;
