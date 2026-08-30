import React, { useEffect, useState } from 'react';
import { useGlobaldata } from '../contexts/masterData/DataContext';
import PopupComponentVersionAcknowledge from '../components/modal/PopupComponentVersionAcknowledge';
import { useLocation } from 'react-router-dom';
import { useFetchUserAckVersion, useFetchVersionHistory } from '../hooks/UseVersionHistory';
import { useAdminVersionHistory } from '../adapters/Api';

const VersionAckowdlege: React.FC = () => {
    const { postUserAcknowledgedVersion } = useAdminVersionHistory();
    const { loggedInUser } = useGlobaldata();
    const location = useLocation();
    const { data: userAck, refetch: refetchUserAck } = useFetchUserAckVersion(loggedInUser?.mail);
    const { data: versHistory, refetch: refetchVersHistory } = useFetchVersionHistory();
    const [isLatestVersionAcknowledged, setIsLatestVersionAcknowledged] = useState<boolean>(false);

    useEffect(() => {
        refetchUserAck();
        refetchVersHistory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname])

    const [latestReleasedVersion, setLatestReleasedVersion] = useState<string | number>(0);

    const convertVersionStringToNumber = (value) => {
        try {
            if (typeof value == "string") {
                const lVer = value?.toLowerCase().replace(/[^0-9.]/g, "");
                return parseInt(lVer).toFixed(0)
            } else return value
        } catch (error) {
            console.log(error);
            return value;
        }

    }

    useEffect(() => {
        if (userAck && versHistory) {
            const ackVersion = userAck.length ? userAck[0].sipVersionAcknowledged : 0;
            const latestVersion = versHistory?.data?.length ? versHistory?.data[0]?.version_number : 0;
            setLatestReleasedVersion(convertVersionStringToNumber(latestVersion));
            setIsLatestVersionAcknowledged(convertVersionStringToNumber(latestVersion) != convertVersionStringToNumber(ackVersion) && convertVersionStringToNumber(latestVersion) != "1");
        }
    }, [userAck, versHistory])

    const updateUserAckVersion = async (closeState) => {
        await postUserAcknowledgedVersion(loggedInUser?.mail, {
            "mail": loggedInUser?.mail,
            "userPrincipalName": loggedInUser?.mail,
            "sipVersionAcknowledged": latestReleasedVersion
        });
        closeState(false);
    }

    return <PopupComponentVersionAcknowledge
        modalState={isLatestVersionAcknowledged}
        setAcknowledgeVersion={updateUserAckVersion} />
}

export default VersionAckowdlege;
