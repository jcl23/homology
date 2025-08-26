import { useThree, useFrame } from '@react-three/fiber';
import { useEffect } from 'react';

export const CameraUpdater = function() {
    const { camera, size } = useThree();

    useEffect(() => {
        // Update aspect ratio on window resize
        const handleResize = () => {
            // camera.aspect = size.width / size.height;
            camera.updateProjectionMatrix();
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [camera, size]); // Depend on camera and size for re-evaluation

    return null;
}