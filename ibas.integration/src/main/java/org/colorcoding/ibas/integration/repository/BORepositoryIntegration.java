package org.colorcoding.ibas.integration.repository;

import java.util.UUID;

import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.bobas.common.IOperationResult;
import org.colorcoding.ibas.bobas.common.OperationResult;
import org.colorcoding.ibas.bobas.repository.BORepositoryServiceApplication;
import org.colorcoding.ibas.integration.bo.integration.IntegrationAction;
import org.colorcoding.ibas.integration.bo.integrationjob.IIntegrationJob;
import org.colorcoding.ibas.integration.bo.integrationjob.IntegrationJob;

/**
 * Integration仓库
 */
public class BORepositoryIntegration extends BORepositoryServiceApplication
		implements IBORepositoryIntegrationSvc, IBORepositoryIntegrationApp {

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-集成动作
	 * 
	 * @param criteria
	 *            查询
	 * @param token
	 *            口令
	 * @return 操作结果
	 */
	public OperationResult<IntegrationAction> fetchIntegrationAction(ICriteria criteria, String token) {
		try {
			this.setUserToken(token);
			OperationResult<IntegrationAction> operationResult = new OperationResult<>();
			IntegrationAction action = new IntegrationAction();
			action.setActionId(UUID.randomUUID().toString());
			action.setActionName("test a");
			operationResult.addResultObjects(action);
			action = new IntegrationAction();
			action.setActionId(UUID.randomUUID().toString());
			action.setActionName("test b");
			operationResult.addResultObjects(action);
			return operationResult;
		} catch (Exception e) {
			return new OperationResult<>(e);
		}
	}

	/**
	 * 查询-集成动作（提前设置用户口令）
	 * 
	 * @param criteria
	 *            查询
	 * @return 操作结果
	 */
	public OperationResult<IntegrationAction> fetchIntegrationAction(ICriteria criteria) {
		return this.fetchIntegrationAction(criteria, this.getUserToken());
	}

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-集成任务
	 * 
	 * @param criteria
	 *            查询
	 * @param token
	 *            口令
	 * @return 操作结果
	 */
	public OperationResult<IntegrationJob> fetchIntegrationJob(ICriteria criteria, String token) {
		return super.fetch(criteria, token, IntegrationJob.class);
	}

	/**
	 * 查询-集成任务（提前设置用户口令）
	 * 
	 * @param criteria
	 *            查询
	 * @return 操作结果
	 */
	public IOperationResult<IIntegrationJob> fetchIntegrationJob(ICriteria criteria) {
		return new OperationResult<IIntegrationJob>(this.fetchIntegrationJob(criteria, this.getUserToken()));
	}

	/**
	 * 保存-集成任务
	 * 
	 * @param bo
	 *            对象实例
	 * @param token
	 *            口令
	 * @return 操作结果
	 */
	public OperationResult<IntegrationJob> saveIntegrationJob(IntegrationJob bo, String token) {
		return super.save(bo, token);
	}

	/**
	 * 保存-集成任务（提前设置用户口令）
	 * 
	 * @param bo
	 *            对象实例
	 * @return 操作结果
	 */
	public IOperationResult<IIntegrationJob> saveIntegrationJob(IIntegrationJob bo) {
		return new OperationResult<IIntegrationJob>(this.saveIntegrationJob((IntegrationJob) bo, this.getUserToken()));
	}

	// --------------------------------------------------------------------------------------------//

}
