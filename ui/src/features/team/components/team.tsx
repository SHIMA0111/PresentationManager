"use client";

import { Text } from "@chakra-ui/react"
import { useTeam } from "../hooks/use-team";
import TeamTable from "./parts/team-table";
import UnassignedAlert from "./parts/unassigned-alert";
import TeamHeader from "./parts/team-header";

export default function Team() {
    const {
        team,
        data,
        unassignPresentations,
        isTeamAdmin,
        handleIncrementUnassign,
    } = useTeam();
    
    return (
        <>
            <TeamHeader />

            <UnassignedAlert count={unassignPresentations} />

            {data.length > 0 ? (
                <TeamTable
                    data={data}
                    team={team}
                    isTeamAdmin={isTeamAdmin}
                    onIncrementUnassign={handleIncrementUnassign}
                />
            ) : (
                <Text>データがありません</Text>
            )}            
        </>
    )
}