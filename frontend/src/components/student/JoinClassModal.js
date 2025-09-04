// import React, { useState } from 'react';
// import { useMutation, useQueryClient } from 'react-query';
// import { toast } from 'react-hot-toast';
// import Modal from '../common/Modal';
// import api from '../../services/api';

// const JoinClassModal = ({ isOpen, onClose }) => {
//   const [classCode, setClassCode] = useState('');
//   const queryClient = useQueryClient();

//   const joinClassMutation = useMutation(
//     (classCode) => api.post('/student/join-class', { classCode }),
//     {
//       onSuccess: () => {
//         toast.success('Successfully joined classroom!');
//         queryClient.invalidateQueries('studentDashboard');
//         onClose();
//         setClassCode('');
//       },
//       onError: (error) => {
//         toast.error(error.response?.data?.error || 'Failed to join classroom');
//       }
//     }
//   );

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!classCode.trim()) return;
//     joinClassMutation.mutate(classCode.toUpperCase());
//   };

//   const handleClose = () => {
//     onClose();
//     setClassCode('');
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={handleClose} title="Join class">
//       <div className="p-6">
//         <p className="text-sm text-gray-600 mb-4">
//           Ask your teacher for the class code, then enter it here.
//         </p>
        
//         <form onSubmit={handleSubmit}>
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Class code
//             </label>
//             <input
//               type="text"
//               value={classCode}
//               onChange={(e) => setClassCode(e.target.value.toUpperCase())}
//               placeholder="Class code"
//               maxLength={6}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               required
//             />
//             <p className="text-xs text-gray-500 mt-1">
//               Use a class code with 6 letters or numbers, no spaces or symbols
//             </p>
//           </div>
          
//           <div className="flex justify-end space-x-3">
//             <button
//               type="button"
//               onClick={handleClose}
//               className="px-4 py-2 text-gray-600 hover:text-gray-700"
//               disabled={joinClassMutation.isLoading}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={!classCode.trim() || joinClassMutation.isLoading}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {joinClassMutation.isLoading ? 'Joining...' : 'Join'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </Modal>
//   );
// };

// export default JoinClassModal;
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import Modal from '../common/Modal';
import api from '../../services/api';
import { useQueryClient } from 'react-query';

const JoinClassModal = ({ isOpen, onClose }) => {
  const [classCode, setClassCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!classCode.trim()) return;
    setIsLoading(true);
    try {
      await api.post('/api/student/join-class', { classCode: classCode.toUpperCase() });
      toast.success('Successfully joined classroom!');
      queryClient.invalidateQueries('studentDashboard');
      onClose();
      setClassCode('');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to join classroom');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setClassCode('');
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Join class">
      <div className="p-6">
        <p className="text-sm text-gray-600 mb-4">
          Ask your teacher for the class code, then enter it here.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Class code
            </label>
            <input
              type="text"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value.toUpperCase())}
              placeholder="Class code"
              maxLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Use a class code with 6 letters or numbers, no spaces or symbols
            </p>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-700"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!classCode.trim() || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Joining...' : 'Join'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default JoinClassModal;
