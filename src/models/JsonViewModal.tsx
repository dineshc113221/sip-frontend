import React, { useState, useEffect, useCallback } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Tooltip,
    useTheme
} from '@mui/material';
import { Close, ContentCopy, ExpandMore, ExpandLess } from '@mui/icons-material';
interface User {
    name: string;
    email: string;
}

interface RawMaterial {
    raw_material_id: string;
    raw_material_name: string;
    raw_material_value: string; // Assuming this is a string based on your JSON.
}
interface Material {
    material_name: string;
    material_type: string;
    converting_process: string;
    material_pct: string;
    _id: string;
    materialId: string;
    pcr_content: string;
}

interface MaterialFieldsExist {

    material_name: string;
    material_type: string;
    converting_process: string;
    material_pct: string;
    _id: string;
    materialId: string;
    pcr_content: string;
}

interface FieldsExist {
    [key: string]: boolean | MaterialFieldsExist | boolean[];
}

interface Component {
    pc_nm: string;
    description: string;
    color: string;
    recyclability_status: string;
    opacity: string;
    component_type: string;
    weight: string;
    opacifier: string;
    stage: string;
    state: string;
    template: string;
    finishing_process: string;
    isDataComplete: boolean;
    isEdited: boolean;
    isCalculated: boolean;
    material: Material[];
    fieldsExist: FieldsExist;
    _id: string;
    componentId: string;
}

interface PackagingLevel {
    packaging_level: string;
    isrecyclable: boolean;
    recyclability_status: string;
    productEvaluation: number;
    components: Component[];
    _id: string;
    rateOfRestitution: number;
}

interface InputData {
    createdAt: string;
    input: RawMaterial;
    productId: string;
    assessmentId: string;
    assessmentType: string;
    assessmentId2: string;
    assessmentType2: string;
    formulaId: string;
    fg_spec: string;
    fg_revision: string;
    sales_country: string;
    production_country: string;
    net_content: string;
    formula_id: string;
    ConsumablesUsed: string;
    productSegment: string;
    productSubSegment: string;
    claimedVolumed: string;
    useDose: string;
    net_content_unit: string;
    productEvaluation: number;
    rateOfRestitution: number;
    user: User; // Reference to the User interface
    raw_materials: RawMaterial[]; // Array of RawMaterial
    packaging_level: PackagingLevel[]; 
}

interface JsonViewModalProps {
    inputData: InputData; 
    open: boolean;
    onClose: () => void;
    onCopy: () => void;
}

const JsonViewModal: React.FC<JsonViewModalProps> = ({ inputData, open, onClose, onCopy }) => {
    const theme = useTheme();
    const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set([""])); // Ensure root is expanded

    // Recursively collect all paths for expansion
    const getAllPaths = useCallback((obj: RawMaterial, currentPath: string = ''): Set<string> => {
       
        const paths = new Set<string>();
        if (typeof obj === 'object' && obj !== null) {
            paths.add(currentPath); // Include parent itself
            Object.entries(obj).forEach(([key, value]) => {
                const newPath = currentPath ? `${currentPath}.${key}` : key;
                paths.add(newPath);
                if (typeof value === 'object' && value !== null) {
                    getAllPaths(value, newPath).forEach(p => paths.add(p));
                }
            });
        }
        return paths;
    }, []); 

    // Automatically expand all parents when inputData changes
    useEffect(() => {
        if (inputData?.input) {
            setExpandedPaths(getAllPaths(inputData.input));
        }
    }, [getAllPaths, inputData]);

    const togglePath = (path: string) => {
        setExpandedPaths(prev => {
            const next = new Set(prev);
            next.has(path) ? next.delete(path) : next.add(path);
            return next;
        });
    };

    const renderValue = (value: RawMaterial, path: string = '', depth: number = 0) => {
        const isExpanded = expandedPaths.has(path);
        const isObject = typeof value === 'object' && value !== null;
        const isArray = Array.isArray(value);

        if (isObject || isArray) {
            return (
                <div style={{ marginLeft: `${depth * 20}px` }}>
                    <button
                        style={{ cursor: 'pointer', color: "#000000", background: 'none', border: 'none', padding: 0 }}
                        onClick={() => togglePath(path)}
                        aria-expanded={isExpanded}
                        aria-label={`Toggle ${isArray ? 'array' : 'object'}`}
                    >
                        {isArray ? '[' : '{'}
                        <IconButton size="small" style={{ padding: 0, marginLeft: 4 }}>
                            {isExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                        </IconButton>
                    </button>
                    {isExpanded && (
                        <div>
                            {Object.entries(value).map(([key, val], index) => (
                                <div key={key}>
                                    <span style={{ color: theme.palette.success.main }}>
                                        {isArray ? `  ${index}: ` : `  "${key}": `}
                                    </span>
                                    {renderValue(val, `${path}.${key}`, depth + 1)}
                                </div>
                            ))}
                        </div>
                    )}
                    {isExpanded && <span>{isArray ? ']' : '}'} </span>}
                </div>
            );
        }

        return <span style={{ color: getValueColor(value) }}>{formatValue(value)}</span>;
    };

    const getValueColor = (value: RawMaterial | InputData) => {
       
        if (typeof value === 'number') return theme.palette.warning.main;
        if (typeof value === 'string') return theme.palette.error.main;
        if (typeof value === 'boolean') return theme.palette.success.main;
        return theme.palette.text.primary;
    };

    const formatValue = (value: RawMaterial | InputData) => {
        if (typeof value === 'string') return `"${value}"`;
        if (value === null) return 'null';
        if (typeof value === 'object') {
            return JSON.stringify(value, null, 2);
        }
        return String(value);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 16px',
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary
            }}>
                <div>
                    Input Data {inputData?.createdAt && ` - ${new Date(inputData.createdAt).toLocaleString()}`}
                </div>
                <div>
                    <Tooltip title="Copy JSON">
                        <IconButton onClick={onCopy} size="small" sx={{ color: theme.palette.text.primary }}>
                            <ContentCopy fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Close">
                        <IconButton onClick={onClose} size="small" sx={{ color: theme.palette.text.primary }}>
                            <Close fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </div>
            </DialogTitle>
            <DialogContent sx={{
                padding: 2,
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                fontFamily: 'kenvue-sans-regular',
                fontSize: '12px',
                minHeight: '60vh'
            }}>
                {inputData?.input ? (
                    renderValue(inputData.input)
                ) : (
                    <div style={{ color: theme.palette.text.secondary }}>No input data available</div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default JsonViewModal;