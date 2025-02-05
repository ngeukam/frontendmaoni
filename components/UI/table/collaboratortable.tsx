import React, { useState } from "react";
import { Switch, Drawer, Button } from "antd";
import { AiOutlineClose, AiOutlineEdit } from "react-icons/ai";
import EnteringBoxEditCollaborator from "../../entering/EnteringBoxEditCollaborator";
import Swal from 'sweetalert2';
import { IUserBusiness } from "../../../lib/types/user";
import { ICollaborator } from "../../../lib/types/collaborator";
import { deleteUserBusiness } from "../../../lib/types/helpers/backendHelpers";
import { useLanguage } from "../../../hooks/useLanguage";


interface CollaboratorsTableProps {
    collaborators: ICollaborator[];
    adminbusinesses: IUserBusiness[];
    onStatusChange: (collaborator: ICollaborator) => void;
    access_token: string;
}

const CollaboratorsTable: React.FC<CollaboratorsTableProps> = ({
    collaborators: initialCollaborators,
    onStatusChange,
    adminbusinesses,
    access_token
}) => {
    const [collaborators, setCollaborators] = useState<ICollaborator[]>(
        Array.isArray(initialCollaborators) ? initialCollaborators : []
    );
    const [visible, setVisible] = useState(false);
    const [selectedCollaborator, setSelectedCollaborator] = useState<ICollaborator | null>(null);

    const showDrawer = (collaborator: ICollaborator) => {
        setSelectedCollaborator(collaborator);
        setVisible(true);
    };
    const { t } = useLanguage();

    const onCloseDrawer = () => {
        setVisible(false);
        setSelectedCollaborator(null);
    };
    const handleDeleteBusiness = async (businessId: string, collaboratorId: string) => {
        if (!Array.isArray(collaborators)) return;
        // Ask user for confirmation
        const result = await Swal.fire({
            title: t.areYouSure || 'Are you sure?',
            text: t.irreversibleAction || 'You won\'t be able to revert this action!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: t.confirmDelete || 'Yes, delete it!',
            cancelButtonText: t.cancelButton || 'No, cancel',
        });

        // If user confirmed the deletion
        if (result.isConfirmed) {
            try {
                const response = await deleteUserBusiness({}, collaboratorId, businessId, access_token);
                if (response?.error === false) {
                    Swal.fire({
                        icon: 'success',
                        title: t.businessRemovedSuccess || 'Business removed successfully!',
                        showConfirmButton: false,
                        timer: 1500
                    });

                    // Update collaborators state
                    setCollaborators((prevCollaborators) =>
                        prevCollaborators.map((collaborator) =>
                            collaborator.id === collaboratorId
                                ? {
                                    ...collaborator,
                                    businesses: (collaborator.businesses ?? []).filter(
                                        (business) => business.id !== businessId
                                    ),
                                }
                                : collaborator
                        )
                    );
                } else {
                    Swal.fire({
                        icon: 'error',
                        confirmButtonColor: '#3085d6',
                        title: response?.detail,
                        showConfirmButton: true
                    });
                }
            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    confirmButtonColor: '#3085d6',
                    title: t.errorDeletingBusiness || 'Error deleting business.',
                    showConfirmButton: true
                });
            }
        } else {
            // If user cancels
            Swal.fire({
                icon: 'info',
                title: t.deletionCancelled || 'Deletion cancelled.',
                showConfirmButton: true
            });
        }
    };


    return (
        <section className="bg-white rounded-lg shadow-md p-4 w-full overflow-x-auto dark:border-slate-200 dark:bg-palette-card dark:text-white">
            <h2 className="text-lg font-bold mb-4 dark:text-blue-400">{t.yourCollaborators || "Your Collaborators"}</h2>
            <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2 text-center dark:border-gray-700">Email</th>
                        <th className="border border-gray-300 px-4 py-2 text-center dark:border-gray-700">{t.role || "Role"}</th>
                        <th className="border border-gray-300 px-4 py-2 text-center dark:border-gray-700">{t.business || "Business"}</th>
                        <th className="border border-gray-300 px-4 py-2 text-center dark:border-gray-700">{t.active || "Active"}</th>
                        <th className="border border-gray-300 px-4 py-2 text-center dark:border-gray-700">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(collaborators) && collaborators.length > 0 ? (
                        collaborators.map((collaborator, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                                <td className="border border-gray-300 px-4 py-2 dark:border-gray-700">{collaborator.email}</td>
                                <td className="border border-gray-300 px-4 py-2 dark:border-gray-700">{collaborator.role}</td>
                                <td className="border border-gray-300 px-4 py-2 dark:border-gray-700">
                                    {collaborator.businesses && collaborator.businesses.length > 0 ? (
                                        collaborator.businesses.map((business) => (
                                            <span
                                                key={business.id}
                                                className="inline-flex items-center bg-gray-200 text-black px-3 py-1 rounded-lg mr-2 mb-2 text-sm"
                                            >
                                                {business.name} • {business.city} • {business.country}
                                                <AiOutlineClose
                                                    className="text-xl ml-2 text-red-500 cursor-pointer font-bold"
                                                    onClick={() => handleDeleteBusiness(business.id ?? "", collaborator.id)}
                                                />
                                            </span>
                                        ))
                                    ) : (
                                        "N/A"
                                    )}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 dark:border-gray-700 text-center">
                                    <Switch
                                        checked={collaborator.is_active}
                                        onChange={() => onStatusChange(collaborator)}
                                        className="toggle-checkbox"
                                    />
                                </td>
                                <td className="border border-gray-300 px-4 py-2 dark:border-gray-700 text-center">
                                    <Button
                                        type="link"
                                        icon={<AiOutlineEdit size={20} />}
                                        onClick={() => showDrawer(collaborator)}
                                    />
                                </td>
                            </tr>
                        ))
                    ) :
                        <p className="text-center text-gray-500 dark:text-gray-400">{t.noCollaboratorFound || "No collaborator found."}</p>

                    }
                </tbody>
            </table>

            <Drawer
                title={`Affectez une entreprise à ${selectedCollaborator?.email}`}
                open={visible}
                onClose={onCloseDrawer}
                width={500}
            >
                {selectedCollaborator && (
                    <EnteringBoxEditCollaborator
                        userbusinesses={adminbusinesses}
                        user_id={selectedCollaborator?.id}
                        token={access_token}
                        selectedemail={selectedCollaborator?.email ?? ""}
                    />
                )}
            </Drawer>
        </section>
    );
};

export default CollaboratorsTable;
