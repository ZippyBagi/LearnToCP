'use client'
import SidebarContainer from '@/app/ui/utils/sideBarContainer';

type SideBarContainerInput = {
    name: string;
    hrefs: string[];
    names: string[];
};

type SidebarSectionInput = {
    containers: SideBarContainerInput[];
};

export default function SidebarSection(input: SidebarSectionInput) {
    return (
        <div className="w-full">
            {input.containers.map((container, i) => (
                <div key={container.name}>
                    {i > 0 && (
                        <div style={{ borderTop: "1px solid rgba(124,158,248,0.1)" }} />
                    )}
                    <SidebarContainer {...container} standalone={false} />
                </div>
            ))}
        </div>
    );
}
