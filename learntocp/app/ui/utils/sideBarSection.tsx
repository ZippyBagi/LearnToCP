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
        <div className="border border-dashed border-blue-500/50 rounded-lg w-9/10 overflow-hidden">
            {input.containers.map((container, i) => (
                <div key={container.name}>
                    {i > 0 && <div className="border-t border-blue-500/50" />}
                    <SidebarContainer {...container} standalone={false} />
                </div>
            ))}
        </div>
    );
}